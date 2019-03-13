import { Color } from 'tns-core-modules/color';

export function setStepperEditorContentOffset(
  editor,
  horizontalOffset: number,
  verticalOffset: number
): void;
export function setStepperEditorTextPostfix(
  editor,
  singularPostfix: string,
  pluralPostfix: string
): void;
export function setStepperEditorColors(
  editor,
  lightColor: Color,
  darkColor: Color
): void;

declare namespace com {
  namespace telerik {
    namespace android {
      namespace common {
        class Procedure<T> {
          constructor(imp);
        }
      }
    }
    namespace widget {
      class RadioGroup {
        setPadding(l, t, r, b);
      }

      namespace numberpicker {
        class RadNumberPicker {
          rootView;
          labelView();
          decreaseView();
          increaseView();
        }
      }
    }
  }
}
