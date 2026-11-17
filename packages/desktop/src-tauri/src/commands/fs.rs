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
pub fn scaffold_project_files(payload: ScaffoldPayload) -> Result<usize, String> {
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
}
