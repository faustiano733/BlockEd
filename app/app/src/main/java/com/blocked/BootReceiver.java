package com.blocked;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.os.Build;
import android.os.SystemClock;

public class BootReceiver extends BroadcastReceiver {
    private static final String TAG = "BootReceiver1";
    private static final long INITIAL_DELAY_MS = 5_000; // 5 segundos

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null
            && Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Log.i(TAG, "BOOT_COMPLETED recebido — agendando LocationService e ApiService");
            scheduleService(context, LocationService.class, 0);
            scheduleService(context, ApiService.class, 1);
        }
    }

    private void scheduleService(Context context, Class<?> serviceClass, int requestCode) {
        Intent svcIntent = new Intent(context, serviceClass);
        PendingIntent pi = PendingIntent.getService(
            context,
            requestCode,
            svcIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23
                ? PendingIntent.FLAG_IMMUTABLE
                : 0)
        );

        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        long triggerAt = SystemClock.elapsedRealtime() + INITIAL_DELAY_MS;

        if (am != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // Android 6.0+: ignora Doze
                am.setExactAndAllowWhileIdle(
                    AlarmManager.ELAPSED_REALTIME_WAKEUP,
                    triggerAt,
                    pi
                );
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                // Android 4.4 – 5.1
                am.setExact(
                    AlarmManager.ELAPSED_REALTIME_WAKEUP,
                    triggerAt,
                    pi
                );
            } else {
                // Antes do 4.4
                am.set(
                    AlarmManager.ELAPSED_REALTIME_WAKEUP,
                    triggerAt,
                    pi
                );
            }
            Log.i(TAG, String.format(
                "Agendado %s em +%dms (requestCode=%d)",
                serviceClass.getSimpleName(),
                INITIAL_DELAY_MS,
                requestCode
            ));
        }
    }
}