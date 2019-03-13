import { CreateCommentRequest } from '~/core/contracts/requests/backlog';
import { CreateCommentResponse } from '~/core/contracts/responses/backlog';

export interface PtCommentService {
  addNewPtComment(
    createCommentRequest: CreateCommentRequest
  ): Promise<CreateCommentResponse>;
}
