import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime', (type) => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
    description = 'Date time formatting YYYY-MM-DD hh:mm:ss';

    parseValue(value: number): Date {
      return new Date(value); // value from the client
    }
  
    serialize(value: Date): string {
        const timeString = value.getTime();
        const koreaTime = new Date(timeString+(540 * 60 * 1000)); // 시간 보정
        const IsoTime = koreaTime.toISOString();
        const IsoTimeArr = IsoTime.split("T");
        const TimeString = `${IsoTimeArr[0]} ${IsoTimeArr[1].substr(0, 8)}`;
        return TimeString;
    }
  
    parseLiteral(ast: ValueNode): Date {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    }
}

@Scalar('Date', (type) => Date)
export class DateScalar implements CustomScalar<string, Date> {
    description = 'Date time formatting YYYY-MM-DD';

    parseValue(value: string): Date {
      return new Date(value); // value from the client
    }
  
    serialize(value: Date): string {
        const timeString = value.getTime();
        const koreaTime = new Date(timeString+(540 * 60 * 1000)); // 시간 보정
        const IsoTime = koreaTime.toISOString();
        const IsoTimeArr = IsoTime.split("T");
        const TimeString = `${IsoTimeArr[0]}`;
    
        return TimeString 
    }
  
    parseLiteral(ast: ValueNode): Date {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    }
}

