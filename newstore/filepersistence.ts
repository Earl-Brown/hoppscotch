import { settingsStore, bulkApplySettings, defaultSettings } from "./settings"
import clone from "lodash/clone"
import assign from "lodash/assign"
import eq from "lodash/eq"
import { fileOpen, fileSave, FileSystemHandle } from "browser-fs-access"

function checkAndMigrateOldSettings() {
  const vuexData = JSON.parse(window.localStorage.getItem("vuex") || "{}")
  if (eq(vuexData, {})) return

  if (vuexData.postwoman && vuexData.postwoman.settings) {
    const settingsData = clone(defaultSettings)
    assign(settingsData, vuexData.postwoman.settings)

    window.localStorage.setItem("settings", JSON.stringify(settingsData))

    delete vuexData.postwoman.settings
    window.localStorage.setItem("vuex", JSON.stringify(vuexData))
  }
}

var latestFile: FileSystemHandle | undefined = undefined;

export function disableAutosave() {
  settingsStore
  .subject$
  .unsubscribe();
}

const commitWorkspaceToFilesystem = async(workspace: object, handle: FileSystemHandle | undefined): Promise<FileSystemHandle> => {
  let asString = JSON.stringify(workspace, undefined, 2)
  let newBlob = new Blob([asString], {type: "application/json"})
  return  await fileSave(
    newBlob,
    handle == undefined
    ? {
      extensions: [".json"]
    }
    : undefined,
    handle
  )

}

export function enableAutosave() {

  settingsStore.subject$
    .subscribe(settings => {
      if (latestFile == null) return

    }
  )
}

export async function loadSettingsFile() {
  const data = {}     // load from file!

  bulkApplySettings(data);

}

export async function saveSettingsFile() {
  const data = {}     // get from store

  latestFile = await commitWorkspaceToFilesystem(data, latestFile)
}

export async function saveNewSettingsFile() {

}
