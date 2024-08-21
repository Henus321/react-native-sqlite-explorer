package com.sqliteexplorer.SqliteExplorerUtils;

import android.app.ActivityManager;
import android.app.ActivityManager.RunningServiceInfo;
import android.app.KeyguardManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.io.File;
import java.lang.Integer;
import javax.annotation.Nonnull;
import android.provider.Settings;

// https://dev.to/mathias5r/how-to-create-an-unstoppable-service-in-react-native-using-headless-js-android-5f61
// https://developer.android.com/guide/components/foreground-services#java
public class SqliteExplorerUtilsModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "SqliteExplorerUtils";
    private static ReactApplicationContext reactContext;
    private BroadcastReceiver screenOnOffReceiver;

    public SqliteExplorerUtilsModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    // получить путь к базе данных
    @ReactMethod
    public void getDBPath(String dbName, Promise p) {
        File dbfile = this.reactContext.getDatabasePath(dbName);

        p.resolve(dbfile.getAbsolutePath());
    }
}
