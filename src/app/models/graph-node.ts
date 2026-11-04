export type NodeType = 'person' | 'city';

export class GraphNode {
  name: string;
  type: NodeType;
  age?: number;

  constructor(name: string, type: NodeType, age?: number) {
    this.name = name;
    this.type = type;
    if (age !== undefined) {
      this.age = age;
    }
  }
}

export class PersonNode extends GraphNode {
  constructor(name: string, age: number) {
    super(name, 'person', age);
  }
}

export class CityNode extends GraphNode {
  constructor(name: string) {
    super(name, 'city');
  }
}
