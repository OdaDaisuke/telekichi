export interface AppSetting {
  setting_type: SettingType
  value: string
  description: string
  default_value: string
}

export enum SettingType {
  MirakurunHost = "mirakurun_host",
  MirakurunPort = "mirakurun_port",
  RecordingDestinationStorage = "recording_destination_storage",
  RecordingDestinationPath = "recording_destination_path",
  RecordingResolution = "recording_resolution",
}

export interface AppSettingsObject {
  mirakurun: {
    host: string
    port: string
  }
  recording: {
    destination: {
      storage: string
      path: string
    }
    resolution: string
  }
}

