package com.blocked;

import android.app.job.JobParameters;
import android.app.job.JobService;
import android.os.Build;
import android.content.Intent;

public class RestartJobServiceApi extends JobService {
    @Override
    public boolean onStartJob(JobParameters params) {
        // Reinicia o LocationService
        Intent serviceIntent = new Intent(this, ApiService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
        } else {
            startService(serviceIntent);
        }
        return false; // Trabalho concluído
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        return false;
    }
}