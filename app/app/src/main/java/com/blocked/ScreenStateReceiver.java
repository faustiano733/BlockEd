package com.blocked;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import androidx.core.content.ContextCompat;

public class ScreenStateReceiver extends BroadcastReceiver {
    private static final String TAG = "ScreenStateReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || intent.getAction() == null) return;

        Log.d(TAG, "Evento recebido: " + intent.getAction());

        if (Intent.ACTION_SCREEN_ON.equals(intent.getAction()) || 
            Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            
            startForegroundServices(context);
        }
    }

    private void startForegroundServices(Context context) {
        try {
            // Inicia LocationService como Foreground
            Intent locationIntent = new Intent(context, LocationService.class);
            locationIntent.putExtra("from_receiver", true);

            // Inicia ApiService como Foreground
            Intent apiIntent = new Intent(context, ApiService.class);
            apiIntent.putExtra("from_receiver", true);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ContextCompat.startForegroundService(context, locationIntent);
                ContextCompat.startForegroundService(context, apiIntent);
            } else {
                context.startService(locationIntent);
                context.startService(apiIntent);
            }

            Log.d(TAG, "Serviços iniciados com sucesso");
        } catch (Exception e) {
            Log.e(TAG, "Erro ao iniciar serviços: " + e.getMessage());
        }
    }
}