import { NativeModule, requireOptionalNativeModule } from "expo";

declare class AppChooserModule extends NativeModule {
  openWithChooser(url: string, title: string): Promise<void>;
}

export default requireOptionalNativeModule<AppChooserModule>("AppChooser");
