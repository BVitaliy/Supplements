export class ManageFavoriteListModel {
  public mode?: ManageFavoriteListModes;
  public titleText?: string;
  public buttonText?: string;
  public listName?: string;
  public listDescription?: string;
}

export enum ManageFavoriteListModes {
  create = 'Create',
  update = 'Update',
  delete = 'Delete',
}
