package com.supplementsocre.ss;
import android.os.Bundle;

import android.app.NotificationManager;
import android.content.Context;

import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  public void onCreate(Bundle savedInstanceState){
    super.onCreate(savedInstanceState);
    registerPlugin(GoogleAuth.class);

    clearBadgeCount();
  }

  private void clearBadgeCount() {
    // Get the NotificationManager system service
    NotificationManager notificationManager =
      (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

    if (notificationManager != null) {
      // Clear all notifications and hence the badge count
      notificationManager.cancelAll();
    }
  }
}

