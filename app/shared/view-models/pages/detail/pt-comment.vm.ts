import { Observable } from 'tns-core-modules/data/observable';
import { PtComment, PtUser } from '~/core/models/domain';

export class PtCommentViewModel extends Observable implements PtComment {
  public id: number;
  public title?: string;
  public dateCreated: Date;
  public dateModified: Date;
  public dateDeleted?: Date;
  public user: PtUser;

  constructor(ptComment: PtComment) {
    super();
    this.id = ptComment.id;
    this.title = ptComment.title;
    this.dateCreated = ptComment.dateCreated;
    this.dateModified = ptComment.dateModified;
    this.dateDeleted = ptComment.dateDeleted;
    this.user = ptComment.user;
  }
}
