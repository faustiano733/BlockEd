package com.blocked;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

public class WatchdogReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("WatchdogReceiver", "Verificando serviços monitorados...");

        checkAndRestartService(context, ApiService.class);
        checkAndRestartService(context, LocationService.class);
        //checkAndRestartService(context, KeyEventInterceptorService.class);
    }

    private void checkAndRestartService(Context context, Class<?> serviceClass) {
        if (!isServiceRunning(context, serviceClass)) {
            Log.d("WatchdogReceiver", serviceClass.getSimpleName() + " inativo. Reiniciando...");
            Intent serviceIntent = new Intent(context, serviceClass);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent);
            } else {
                context.startService(serviceIntent);
            }
        }
    }

    private boolean isServiceRunning(Context context, Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}
