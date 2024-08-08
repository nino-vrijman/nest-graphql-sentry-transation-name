import * as Sentry from '@sentry/nestjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { FieldNode, SelectionNode } from 'graphql';
import { Observable, tap } from 'rxjs';

function getOperationName(info: any) {
  const operationName = info.operation?.name?.value;
  if (operationName) {
    return `GraphQL ${info.operation.operation} ${operationName}`;
  }

  const fieldNames = info.operation.selectionSet.selections
    .filter((n: SelectionNode): n is FieldNode => n.kind === 'Field')
    .map(({ name }) => name.value)
    .join(', ') as string;

  return `GraphQL ${info.operation.operation} ${fieldNames || '/graphql'}`;
}

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const operationName = getOperationName(
        GqlExecutionContext.create(context).getInfo(),
      );

      console.log(operationName);

      return next.handle().pipe(
        tap(() => {
          // const active = Sentry.getActiveSpan();
          // console.log({ 'active span before': active });
          // active && active.updateName(`activeSpan ${operationName}`);
          // console.log({ 'active span after': active });

          // const root = active && Sentry.getRootSpan(active);
          // console.log({ 'root span before': root });
          // root && root.updateName(`rootSpan ${operationName}`);
          // console.log({ 'root span after': root });

          // const currentScope = Sentry.getCurrentScope();
          // console.log({ 'current scope before': currentScope });
          // currentScope &&
          //   currentScope.setTransactionName(`currentScope ${operationName}`);
          // console.log({ 'current scope after': currentScope });

          // const isolationScope = Sentry.getIsolationScope();
          // console.log({ 'isolation scope before': isolationScope });
          // isolationScope.setTransactionName(`isolationScope ${operationName}`);
          // console.log({ 'isolation scope after': isolationScope });
          // const span = Sentry.getActiveSpan();
          // if (span) {
          //   const rootSpan = Sentry.getRootSpan(span);
          //   rootSpan.updateName(operationName);
          //   rootSpan.setAttribute('sentry.skip_span_data_inference', true);
          //   console.log(rootSpan);
          // }

          // // set this to have the same transaction name reported for error events
          // Sentry.getCurrentScope().setTransactionName(operationName);
          // console.log('HE TAPPED', operationName);
        }),
      );
    }
    return next.handle();
  }
}
