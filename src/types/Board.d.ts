export class Board {
  id: number;
  name: string;
  BoardColumns: BoardColumn[];
  BoardLabels: BoardLabel[];
  BoardMembers: BoardMember[];
}

export class BoardColumn {
  name: string;
  id: number;
  BoardColumnCards: BoardColumnCard[];
}

export class BoardColumnCard {
  id: number;
  summary: string;
  description: string;
  dueDate: Date | null;
  boardColumnId: number;
}

export class BoardLabel {
  id: number;
  name: string;
  color: string;
  boardId: number;
}

export class BoardMember {
  Member: Member;
  memberRole: string;
  memberId: number;
}

export class Member {
  id: number;
  email: string;
  fullName: string;
}
