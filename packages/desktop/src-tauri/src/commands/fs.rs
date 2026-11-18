use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Serialize, Deserialize, Debug)]
pub struct PathValidationResult {
    pub exists: bool,
    pub is_dir: bool,
    pub is_empty: bool,
    pub is_writeable: bool,
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VirtualFilePayload {
    pub path: String,
    pub content: String,
    pub executable: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ScaffoldPayload {
    pub target_path: String,
    pub files: Vec<VirtualFilePayload>,
    pub git_init: bool,
    pub run_install: bool,
    pub package_manager: String,
}

#[tauri::command]
pub fn validate_target_path(target_path: String) -> Result<PathValidationResult, String> {
    let path = Path::new(&target_path);

    if !path.exists() {
        let parent = path.parent().unwrap_or_else(|| Path::new("."));
        let is_writeable = match fs::metadata(parent) {
            Ok(metadata) => !metadata.permissions().readonly(),
            Err(_) => false,
        };

        return Ok(PathValidationResult {
            exists: false,
            is_dir: false,
            is_empty: true,
            is_writeable,
            error: None,
        });
    }

    let metadata = match fs::metadata(path) {
        Ok(m) => m,
        Err(e) => {
            return Ok(PathValidationResult {
                exists: true,
                is_dir: false,
                is_empty: false,
                is_writeable: false,
                error: Some(format!("Failed to read path metadata: {}", e)),
            });
        }
    };

    let is_dir = metadata.is_dir();
    let is_writeable = !metadata.permissions().readonly();

    let mut is_empty = true;
    if is_dir {
        if let Ok(entries) = fs::read_dir(path) {
            is_empty = entries.count() == 0;
        }
    }

    Ok(PathValidationResult {
        exists: true,
        is_dir,
        is_empty,
        is_writeable,
        error: None,
    })
}

#[tauri::command]
pub async fn scaffold_project_files(payload: ScaffoldPayload) -> Result<usize, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let target = Path::new(&payload.target_path);
        if !target.exists() {
            fs::create_dir_all(target).map_err(|e| format!("Failed to create destination dir: {}", e))?;
        }

        for file in &payload.files {
            let full_path = target.join(&file.path);
            if let Some(parent) = full_path.parent() {
                fs::create_dir_all(parent).map_err(|e| format!("Failed to create parent dir: {}", e))?;
            }
            fs::write(&full_path, &file.content).map_err(|e| format!("Failed to write file {}: {}", file.path, e))?;

            #[cfg(unix)]
            if file.executable.unwrap_or(false) {
                use std::os::unix::fs::PermissionsExt;
                let _ = fs::set_permissions(&full_path, fs::Permissions::from_mode(0o755));
            }
        }

        if payload.git_init {
            let _ = std::process::Command::new("git").arg("init").current_dir(target).output();
            let _ = std::process::Command::new("git").args(["add", "-A"]).current_dir(target).output();
            let _ = std::process::Command::new("git").args(["commit", "-m", "feat: initial scaffold by ForgeStack"]).current_dir(target).output();
        }

        if payload.run_install {
            let pm = if payload.package_manager.is_empty() { "pnpm" } else { &payload.package_manager };
            let _ = std::process::Command::new(pm).arg("install").current_dir(target).output();
        }

        Ok(payload.files.len())
    })
    .await
    .map_err(|e| format!("Scaffold task failed: {}", e))?
}

#[tauri::command]
pub fn open_in_vscode(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("cmd").args(["/C", "code", &path]).spawn();
    }
    #[cfg(not(target_os = "windows"))]
    {
        let status = std::process::Command::new("code").arg(&path).spawn();
        if status.is_err() {
            let _ = std::process::Command::new("cursor").arg(&path).spawn();
        }
    }
    Ok(())
}

#[tauri::command]
pub fn open_in_folder(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("explorer").arg(&path).spawn();
    }
    #[cfg(target_os = "macos")]
    {
        let _ = std::process::Command::new("open").arg(&path).spawn();
    }
    #[cfg(target_os = "linux")]
    {
        let _ = std::process::Command::new("xdg-open").arg(&path).spawn();
    }
    Ok(())
}

#[tauri::command]
pub async fn pick_directory(
    app: tauri::AppHandle,
    title: Option<String>,
    default_path: Option<String>,
) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;

    // 1. Try native dialog via tauri_plugin_dialog
    let mut builder = app.dialog().file();
    if let Some(ref t) = title {
        builder = builder.set_title(t);
    }
    if let Some(ref d) = default_path {
        builder = builder.set_directory(Path::new(d));
    }

    if let Some(folder) = builder.blocking_pick_folder() {
        if let Ok(path) = folder.into_path() {
            return Ok(Some(path.to_string_lossy().to_string()));
        }
    }

    // 2. Fallback on Linux: zenity --file-selection --directory
    #[cfg(target_os = "linux")]
    {
        let mut cmd = std::process::Command::new("zenity");
        cmd.arg("--file-selection").arg("--directory");
        if let Some(ref t) = title {
            cmd.arg(format!("--title={}", t));
        }
        if let Some(ref d) = default_path {
            if Path::new(d).exists() {
                cmd.arg(format!("--filename={}/", d.trim_end_matches('/')));
            }
        }

        if let Ok(output) = cmd.output() {
            if output.status.success() {
                let chosen = String::from_utf8_lossy(&output.stdout).trim().to_string();
                if !chosen.is_empty() {
                    return Ok(Some(chosen));
                }
            }
        }
    }

    Ok(None)
}

#[tauri::command]
pub async fn start_dev_stack(target_path: String, package_manager: Option<String>) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let path = Path::new(&target_path);
        if !path.exists() {
            return Err("Target path does not exist on disk".to_string());
        }

        let pm = package_manager.unwrap_or_else(|| "pnpm".to_string());

        #[cfg(target_os = "linux")]
        {
            let _ = std::process::Command::new("sh")
                .arg("-c")
                .arg(format!("cd \"{}\" && {} run dev", target_path, pm))
                .spawn();
        }

        #[cfg(not(target_os = "linux"))]
        {
            let _ = std::process::Command::new(&pm)
                .arg("run")
                .arg("dev")
                .current_dir(path)
                .spawn();
        }

        Ok(format!("Dev stack process spawned in {}", target_path))
    })
    .await
    .map_err(|e| format!("Task execution error: {}", e))?
}
