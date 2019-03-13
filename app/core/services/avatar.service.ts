import { PtUser } from '~/core/models/domain';

export function getUserAvatarUrl(apiEndPoint: string, userId: number) {
  return `${apiEndPoint}/photo/${userId}`;
}

export function setUserAvatar(apiEndpoint: string, user: PtUser) {
  user.avatar = getCurrentUserAvatar(apiEndpoint, user.id);
}

export function getCurrentUserAvatar(
  apiEndpoint: string,
  currentUserId: number
) {
  return getUserAvatarUrl(apiEndpoint, currentUserId);
}
