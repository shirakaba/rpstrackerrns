import { PtNewComment } from '~/core/models/dto/backlog';
import { PtItem } from '~/core/models/domain';

export interface CreateCommentRequest {
  newComment: PtNewComment;
  currentItem: PtItem;
}

export function toCreateCommentRequest(
  newComment: PtNewComment,
  currentItem: PtItem
): CreateCommentRequest {
  return {
    newComment,
    currentItem
  };
}
