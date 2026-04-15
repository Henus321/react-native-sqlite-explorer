package com.sqliteexplorer

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import java.util.HashMap

class SqliteExplorerPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return null
    // return if (name == SqliteExplorerModule.NAME) {
    //   SqliteExplorerModule(reactContext)
    // } else {
    //   null
    // }
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
    //   SqliteExplorerModule.NAME to ReactModuleInfo(
    //     name = SqliteExplorerModule.NAME,
    //     className = SqliteExplorerModule.NAME,
    //     canOverrideExistingModule = false,
    //     needsEagerInit = false,
    //     isCxxModule = false,
    //     isTurboModule = true
    //   )
    )
  }
}
