
import { FC } from "react";
import { IonItem, IonAvatar, IonSkeletonText, IonItemDivider, IonLabel } from "@ionic/react";

export const Item: FC<{ withAvatar?: true }> = ({ withAvatar }) =>
    <IonItem>
        {withAvatar && <IonAvatar slot='start'>
            <IonSkeletonText {...{ animated: true } as any} />
        </IonAvatar>
        }
        <IonLabel>
            <h2>
                <IonSkeletonText style={{ width: '60%' }} {...{ animated: true } as any} />
            </h2>
            <p>
                <IonSkeletonText style={{ width: '30%' }} {...{ animated: true } as any} />
            </p>
        </IonLabel>
    </IonItem>

export const Divider = () =>
    <IonItemDivider color='light'>
        <IonSkeletonText style={{ width: '20%' }} {...{ animated: true } as any} />
    </IonItemDivider>
