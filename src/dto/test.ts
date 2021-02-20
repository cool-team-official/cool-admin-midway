import { Rule, RuleType } from "@midwayjs/decorator";

export class UserDTO {
  @Rule(RuleType.number().required())
  id: number;
  
  @Rule(RuleType.string().required())
  firstName: string;

  @Rule(RuleType.string().max(10))
  lastName: string;
  
  @Rule(RuleType.number().max(60))
  age: number;
}