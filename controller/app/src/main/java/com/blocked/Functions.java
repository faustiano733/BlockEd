package com.blocked;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;
import java.util.Calendar;
import java.util.Date;
import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.FileWriter;

import org.json.JSONObject;
import org.json.JSONArray;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import android.provider.Settings;
import android.content.Context;
import android.widget.Toast;

public class Functions {
	private static final String FILE_PATH = "/storage/emulated/0/Documents/blocked_attempts.json";

	public static void createAttempt(String type, String value){
		new Thread(() -> {
			/*try{
				Thread.sleep(1000);
			} catch(Exception e){

			}*/

			Date now = new Date();
			int day = now.getDate();
			int month = (now.getMonth() + 1);
			int year = (now.getYear() + 1900);
			String date =  day + "/" + (month < 10 ? "0" + month  : month) + "/" + year;
		

			try{
				JSONObject attempt = new JSONObject();
				JSONObject fileJson;

				attempt.put("type", type);
				attempt.put("value", value);
				attempt.put("created_at", date);

				File file = new File(FILE_PATH);

				if(file.exists()){
					BufferedReader reader = new BufferedReader(new FileReader(file));
					StringBuilder content = new StringBuilder();
					String line;
        			while ((line = reader.readLine()) != null) {
            			content.append(line);
        			}

        			fileJson = new JSONObject(content.toString());
        			JSONArray jarray = fileJson.getJSONArray("attempts");
        			jarray.put(attempt);

        			fileJson.put("attempts", jarray);

				} else {
					JSONArray jarray = new JSONArray();
					jarray.put(attempt);

					fileJson = new JSONObject();
					fileJson.put("attempts", jarray);
				}

				FileWriter writer = new FileWriter(file);
				writer.write(fileJson.toString(2));
				writer.close();

			} catch(Exception e){
				System.err.println(e);
			}

			//System.out.println("Data: " + day + "/" + (month < 10 ? "0" + month  : month) + "/" + year);	
		}).start();
	}

	//private void attemptCriation(String type, String value){
		
	//}	

	public static boolean isException(Context context){
		String EXCEPTION_PATH = "/storage/emulated/0/Documents/blocked_exceptions.txt";
		File file = new File(EXCEPTION_PATH);
		Set<String> exceptions = new HashSet<>();
		Date now = new Date();
		int day = now.getDate();
		int month = (now.getMonth() + 1);
		boolean isAutoTime = Settings.Global.getInt(context.getContentResolver(), Settings.Global.AUTO_TIME, 0) == 1;

		if(!isAutoTime){
			Toast.makeText(context, "Data incorrecta, redefina", Toast.LENGTH_LONG).show();
			return false;
		}

		try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                exceptions.add(line.trim());
            }
        
        } catch (Exception e) {
            //return new String[0];
        }
        String cmp = (day < 10 ? "0"+day : day) + "/" + (month < 10 ? "0"+month : month);
        System.out.println(cmp);
        return exceptions.contains(cmp) && isAutoTime;
	}
}