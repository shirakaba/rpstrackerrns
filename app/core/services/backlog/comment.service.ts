// import { appStore } from '~/core/app-store';
import { PtBacklogRepository } from '~/core/contracts/repositories';
import { CreateCommentRequest } from '~/core/contracts/requests/backlog';
import { CreateCommentResponse } from '~/core/contracts/responses/backlog';
import {
  PtAuthService,
  PtCommentService,
  PtLoggingService
} from '~/core/contracts/services';
import { PtComment } from '~/core/models/domain';

export class CommentService implements PtCommentService {
  constructor(
    private loggingService: PtLoggingService,
    private backlogRepo: PtBacklogRepository,
    private authService: PtAuthService
  ) {}

  public addNewPtComment(
    createCommentRequest: CreateCommentRequest
  ): Promise<CreateCommentResponse> {
    const comment: PtComment = {
      id: 0,
      title: createCommentRequest.newComment.title,
      user: this.authService.getCurrentUser(),
      dateCreated: new Date(),
      dateModified: new Date()
    };

    return new Promise<CreateCommentResponse>((resolve, reject) => {
      this.backlogRepo.insertPtComment(
        comment,
        createCommentRequest.currentItem.id,
        error => {
          this.loggingService.error('Adding new comment failed');
          reject(error);
        },
        (nextComment: PtComment) => {
          const response: CreateCommentResponse = {
            createdComment: nextComment
          };
          resolve(response);
        }
      );
    });
  }
}
