import * as React from "react";
import { $FlexboxLayout, $Button } from "react-nativescript";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { getBacklogService } from "~/globals/dependencies/locator";
import { goToSettingsPage } from "~/shared/helpers/navigation/nav.helper";
import { PtBacklogService } from "~/core/contracts/services";

interface Props {
    onPresetSelected: (preset: "my"|"open"|"closed") => void;
    onSettingsTap: () => void;
}

interface State {
}

export class Menu extends React.Component<Props, State> {
    public render(){
        return (
            <$FlexboxLayout className="menu-wrapper">
                <$Button onTap={this.onSelectPresetTapMy} text="MY ITEMS" className="btn-inverse" />
                <$Button onTap={this.onSelectPresetTapOpen} text="OPEN ITEMS" className="btn-inverse"/>
                <$Button onTap={this.onSelectPresetTapClosed} text="FINISHED ITEMS" className="btn-inverse"/>

                <$Button onTap={this.onSettingsTap} text="SETTINGS" className="btn-inverse"/>
            </$FlexboxLayout>
        );
    }

    private readonly onSelectPresetTapMy = (args: GestureEventData) => {
        this.onSelectPresetTap("my");
    };
    private readonly onSelectPresetTapOpen = (args: GestureEventData) => {
        this.onSelectPresetTap("open");
    };
    private readonly onSelectPresetTapClosed = (args: GestureEventData) => {
        this.onSelectPresetTap("closed");
    };

    private readonly onSelectPresetTap = (preset: "my"|"open"|"closed") => {
        const backlogService: PtBacklogService = getBacklogService();
        backlogService.setPreset(preset).then(() => {
            // this.container.presetSelected.apply(this.container.page.bindingContext, [preset]);
            this.props.onPresetSelected(preset);
        });
    }
    private readonly onSettingsTap = (args: GestureEventData) => {
        this.props.onSettingsTap();
    };
}