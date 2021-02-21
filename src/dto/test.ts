import { Rule, RuleType } from "@midwayjs/decorator";

export class TestDTO {
  
  @Rule(RuleType.string().required())
  firstName: string;

  @Rule(RuleType.string().max(10))
  lastName: string;
  
  @Rule(RuleType.number().max(60))
  age: number;
}