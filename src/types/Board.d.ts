export interface Board {
  id: number;
  name: string;
  backgroundUrl: string;
  BoardColumns: BoardColumn[];
  BoardLabels: Label[];
  BoardMembers: BoardMember[];
}

export interface BoardColumn {
  name: string;
  id: number;
  BoardColumnCards: BoardColumnCard[];
}

export interface BoardColumnCard {
  id: number;
  cardIdx: number;
  Comments: Comment[];
  description: string;
  dueDate: null | string;
  Labels: Label[];
  Members: Member[];
  summary: string;
}

export class Comment {
  id: number;
  createdDate: string;
  content: string;
  Creator: Member;
  boardColumnCardId: number;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface BoardMember {
  Member: Member;
  memberRole: string;
  memberId: number;
}

export interface Member {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string;
}
