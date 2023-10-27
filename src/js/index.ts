import { Platform } from "react-native";
import SpInAppUpdates, { IAUUpdateKind } from "sp-react-native-in-app-updates";

const inAppUpdates = new SpInAppUpdates(
    false // isDebug
);

export default function createUpdateService({
    checkUpdateTryCount = 3,
    checkUpdateRetryDelay = 2000,
    title,
    message,
    buttonCancelText,
    buttonUpgradeText
}: {
    checkUpdateTryCount?: number,
    checkUpdateRetryDelay?: number,
    title: string,
    message: string,
    buttonCancelText: string,
    buttonUpgradeText: string
}) {
    return async (force: boolean) => {
        for (let i = 0; i < checkUpdateTryCount; i++) {
            try {
                if ((await inAppUpdates.checkNeedsUpdate()).shouldUpdate) {
                    inAppUpdates.startUpdate(Platform.OS === "android" ? {
                        updateType: force ? IAUUpdateKind.IMMEDIATE : IAUUpdateKind.FLEXIBLE
                    } : {
                        title,
                        message,
                        buttonCancelText,
                        buttonUpgradeText,
                        forceUpgrade: force
                    });
                }
                return;
            }
            catch {
                await new Promise<void>(resolve => setTimeout(resolve, checkUpdateRetryDelay));
            }
        }
    }
}