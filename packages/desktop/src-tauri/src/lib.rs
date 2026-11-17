pub mod commands;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::fs::validate_target_path,
            commands::fs::scaffold_project_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running ForgeStack desktop application");
}
