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

public class Functions {
	private static final String FILE_PATH = "/storage/emulated/0/Documents/blocked_attempts.json";

	public static void createAttempt(String type, String value){
		new Thread(() -> {
			try{
				Thread.sleep(10000);
			} catch(Exception e){

			}
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
}