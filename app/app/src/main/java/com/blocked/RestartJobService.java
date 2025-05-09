package com.blocked;

import android.app.job.JobParameters;
import android.app.job.JobService;
import android.os.Build;
import android.content.Intent;

public class RestartJobService extends JobService {
    @Override
    public boolean onStartJob(JobParameters params) {
        // Reinicia o LocationService
        Intent serviceIntent = new Intent(this, LocationService.class);
        Intent serviceIntent2 = new Intent(this, ApiService.class);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
            startForegroundService(serviceIntent2);
        } else {
            startService(serviceIntent);
            startService(serviceIntent2);
        }
        return false; // Trabalho concluído
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        return false;
    }
}