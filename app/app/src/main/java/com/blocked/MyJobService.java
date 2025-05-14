package com.blocked;

import android.app.job.JobParameters;
import android.app.job.JobService;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import androidx.core.content.ContextCompat;

public class MyJobService extends JobService {
    private static final String TAG = "MyJobService";

    @Override
    public boolean onStartJob(JobParameters params) {
        Log.d(TAG, "Job iniciado. Iniciando serviços...");

        Intent locationIntent = new Intent(this, LocationService.class);
        Intent apiIntent = new Intent(this, ApiService.class);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ContextCompat.startForegroundService(this, locationIntent);
            ContextCompat.startForegroundService(this, apiIntent);
        } else {
            startService(locationIntent);
            startService(apiIntent);
        }

        // Job terminou o trabalho
        jobFinished(params, false);
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        Log.d(TAG, "Job cancelado.");
        return false;
    }
}
