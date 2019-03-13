import { PtUser } from '~/core/models/domain';
import { PtModalListDisplayItem } from '~/shared/helpers/modals';

export function ptUserToModalListDisplayItem(
  u: PtUser
): PtModalListDisplayItem<PtUser> {
  if (!u) {
    return undefined;
  } else {
    const di: PtModalListDisplayItem<PtUser> = {
      key: u.id.toString(),
      value: u.fullName,
      img: u.avatar,
      payload: u
    };
    return di;
  }
}
