// export class Board {
//   id: number;
//   name: string;
//   BoardColumns: BoardColumn[];
//   BoardLabels: BoardLabel[];
//   BoardMembers: BoardMember[];
// }

// export class BoardColumn {
//   name: string;
//   id: number;
//   BoardColumnCards: BoardColumnCard[];
// }

// export class BoardColumnCard {
//   id: number;
//   summary: string;
//   description: string;
//   dueDate: Date | null;
//   boardColumnId: number;
// }

// export class BoardLabel {
//   id: number;
//   name: string;
//   color: string;
//   boardId: number;
// }

// export class BoardMember {
//   Member: Member;
//   memberRole: string;
//   memberId: number;
// }

// export class Member {
//   id: number;
//   email: string;
//   fullName: string;
// }

export interface Board {
  id: number;
  name: string;
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

export interface Comment {
  id: number;
  content: string;
  creatorId: number;
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
}
