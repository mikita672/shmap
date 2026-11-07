import { NativeModule, requireOptionalNativeModule } from "expo";

declare class AppChooserModule extends NativeModule {}

export default requireOptionalNativeModule<AppChooserModule>("AppChooser");
