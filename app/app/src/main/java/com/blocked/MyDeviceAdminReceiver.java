package com.blocked;

import android.app.admin.DeviceAdminReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;
import android.os.Build;
import android.util.Log;
import androidx.core.content.ContextCompat;

public class MyDeviceAdminReceiver extends DeviceAdminReceiver {
    @Override
    public void onEnabled(Context context, Intent intent) {
        Toast.makeText(context, "Modo Administrador Ativado!", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onDisabled(Context context, Intent intent) {
        Toast.makeText(context, "Modo Administrador Desativado!", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onPasswordSucceeded(Context context, Intent intent){
        super.onPasswordSucceeded(context, intent);
        startForegroundServices(context);

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

            Log.d("admin", "Serviços iniciados com sucesso");
        } catch (Exception e) {
            Log.e("admin", "Erro ao iniciar serviços: " + e.getMessage());
        }
    }
}