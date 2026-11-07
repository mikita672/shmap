package expo.modules.appchooser

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppChooserModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AppChooser")

    AsyncFunction("openWithChooser") { url: String, title: String ->
      val activity = appContext.throwingActivity
      val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        .addCategory(Intent.CATEGORY_BROWSABLE)

      val targets = activity.packageManager
        .queryIntentActivities(intent, PackageManager.MATCH_ALL)
        .map { it.activityInfo }
        .filter { it.packageName != activity.packageName }
        .distinctBy { it.packageName }
        .map { Intent(intent).setClassName(it.packageName, it.name) }

      if (targets.isEmpty()) {
        activity.startActivity(intent)
        return@AsyncFunction
      }

      val chooser = Intent.createChooser(targets.first(), title)
        .putExtra(Intent.EXTRA_INITIAL_INTENTS, targets.drop(1).toTypedArray())
      activity.startActivity(chooser)
    }
  }
}
