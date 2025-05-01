
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Address
 * 
 */
export type Address = $Result.DefaultSelection<Prisma.$AddressPayload>
/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model Orderdelivery
 * 
 */
export type Orderdelivery = $Result.DefaultSelection<Prisma.$OrderdeliveryPayload>
/**
 * Model Register
 * 
 */
export type Register = $Result.DefaultSelection<Prisma.$RegisterPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Addresses
 * const addresses = await prisma.address.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Addresses
   * const addresses = await prisma.address.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.address`: Exposes CRUD operations for the **Address** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Addresses
    * const addresses = await prisma.address.findMany()
    * ```
    */
  get address(): Prisma.AddressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderdelivery`: Exposes CRUD operations for the **Orderdelivery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orderdeliveries
    * const orderdeliveries = await prisma.orderdelivery.findMany()
    * ```
    */
  get orderdelivery(): Prisma.OrderdeliveryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.register`: Exposes CRUD operations for the **Register** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Registers
    * const registers = await prisma.register.findMany()
    * ```
    */
  get register(): Prisma.RegisterDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Address: 'Address',
    Client: 'Client',
    Orderdelivery: 'Orderdelivery',
    Register: 'Register'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "address" | "client" | "orderdelivery" | "register"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Address: {
        payload: Prisma.$AddressPayload<ExtArgs>
        fields: Prisma.AddressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AddressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AddressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findFirst: {
            args: Prisma.AddressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AddressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findMany: {
            args: Prisma.AddressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          create: {
            args: Prisma.AddressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          createMany: {
            args: Prisma.AddressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AddressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          update: {
            args: Prisma.AddressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          deleteMany: {
            args: Prisma.AddressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AddressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AddressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          aggregate: {
            args: Prisma.AddressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAddress>
          }
          groupBy: {
            args: Prisma.AddressGroupByArgs<ExtArgs>
            result: $Utils.Optional<AddressGroupByOutputType>[]
          }
          count: {
            args: Prisma.AddressCountArgs<ExtArgs>
            result: $Utils.Optional<AddressCountAggregateOutputType> | number
          }
        }
      }
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      Orderdelivery: {
        payload: Prisma.$OrderdeliveryPayload<ExtArgs>
        fields: Prisma.OrderdeliveryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderdeliveryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderdeliveryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload>
          }
          findFirst: {
            args: Prisma.OrderdeliveryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderdeliveryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload>
          }
          findMany: {
            args: Prisma.OrderdeliveryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload>[]
          }
          create: {
            args: Prisma.OrderdeliveryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload>
          }
          createMany: {
            args: Prisma.OrderdeliveryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OrderdeliveryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload>
          }
          update: {
            args: Prisma.OrderdeliveryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload>
          }
          deleteMany: {
            args: Prisma.OrderdeliveryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderdeliveryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderdeliveryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderdeliveryPayload>
          }
          aggregate: {
            args: Prisma.OrderdeliveryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderdelivery>
          }
          groupBy: {
            args: Prisma.OrderdeliveryGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderdeliveryGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderdeliveryCountArgs<ExtArgs>
            result: $Utils.Optional<OrderdeliveryCountAggregateOutputType> | number
          }
        }
      }
      Register: {
        payload: Prisma.$RegisterPayload<ExtArgs>
        fields: Prisma.RegisterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RegisterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RegisterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload>
          }
          findFirst: {
            args: Prisma.RegisterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RegisterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload>
          }
          findMany: {
            args: Prisma.RegisterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload>[]
          }
          create: {
            args: Prisma.RegisterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload>
          }
          createMany: {
            args: Prisma.RegisterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RegisterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload>
          }
          update: {
            args: Prisma.RegisterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload>
          }
          deleteMany: {
            args: Prisma.RegisterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RegisterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RegisterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterPayload>
          }
          aggregate: {
            args: Prisma.RegisterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRegister>
          }
          groupBy: {
            args: Prisma.RegisterGroupByArgs<ExtArgs>
            result: $Utils.Optional<RegisterGroupByOutputType>[]
          }
          count: {
            args: Prisma.RegisterCountArgs<ExtArgs>
            result: $Utils.Optional<RegisterCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    address?: AddressOmit
    client?: ClientOmit
    orderdelivery?: OrderdeliveryOmit
    register?: RegisterOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AddressCountOutputType
   */

  export type AddressCountOutputType = {
    register: number
  }

  export type AddressCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    register?: boolean | AddressCountOutputTypeCountRegisterArgs
  }

  // Custom InputTypes
  /**
   * AddressCountOutputType without action
   */
  export type AddressCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AddressCountOutputType
     */
    select?: AddressCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AddressCountOutputType without action
   */
  export type AddressCountOutputTypeCountRegisterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegisterWhereInput
  }


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    register: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    register?: boolean | ClientCountOutputTypeCountRegisterArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountRegisterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegisterWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Address
   */

  export type AggregateAddress = {
    _count: AddressCountAggregateOutputType | null
    _avg: AddressAvgAggregateOutputType | null
    _sum: AddressSumAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  export type AddressAvgAggregateOutputType = {
    id: number | null
    numberHouse: number | null
  }

  export type AddressSumAggregateOutputType = {
    id: number | null
    numberHouse: number | null
  }

  export type AddressMinAggregateOutputType = {
    id: number | null
    street: string | null
    neighborhood: string | null
    numberHouse: number | null
    reference: string | null
    city: string | null
  }

  export type AddressMaxAggregateOutputType = {
    id: number | null
    street: string | null
    neighborhood: string | null
    numberHouse: number | null
    reference: string | null
    city: string | null
  }

  export type AddressCountAggregateOutputType = {
    id: number
    street: number
    neighborhood: number
    numberHouse: number
    reference: number
    city: number
    _all: number
  }


  export type AddressAvgAggregateInputType = {
    id?: true
    numberHouse?: true
  }

  export type AddressSumAggregateInputType = {
    id?: true
    numberHouse?: true
  }

  export type AddressMinAggregateInputType = {
    id?: true
    street?: true
    neighborhood?: true
    numberHouse?: true
    reference?: true
    city?: true
  }

  export type AddressMaxAggregateInputType = {
    id?: true
    street?: true
    neighborhood?: true
    numberHouse?: true
    reference?: true
    city?: true
  }

  export type AddressCountAggregateInputType = {
    id?: true
    street?: true
    neighborhood?: true
    numberHouse?: true
    reference?: true
    city?: true
    _all?: true
  }

  export type AddressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Address to aggregate.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Addresses
    **/
    _count?: true | AddressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AddressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AddressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AddressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AddressMaxAggregateInputType
  }

  export type GetAddressAggregateType<T extends AddressAggregateArgs> = {
        [P in keyof T & keyof AggregateAddress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAddress[P]>
      : GetScalarType<T[P], AggregateAddress[P]>
  }




  export type AddressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AddressWhereInput
    orderBy?: AddressOrderByWithAggregationInput | AddressOrderByWithAggregationInput[]
    by: AddressScalarFieldEnum[] | AddressScalarFieldEnum
    having?: AddressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AddressCountAggregateInputType | true
    _avg?: AddressAvgAggregateInputType
    _sum?: AddressSumAggregateInputType
    _min?: AddressMinAggregateInputType
    _max?: AddressMaxAggregateInputType
  }

  export type AddressGroupByOutputType = {
    id: number
    street: string
    neighborhood: string
    numberHouse: number
    reference: string
    city: string
    _count: AddressCountAggregateOutputType | null
    _avg: AddressAvgAggregateOutputType | null
    _sum: AddressSumAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  type GetAddressGroupByPayload<T extends AddressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AddressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AddressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AddressGroupByOutputType[P]>
            : GetScalarType<T[P], AddressGroupByOutputType[P]>
        }
      >
    >


  export type AddressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    street?: boolean
    neighborhood?: boolean
    numberHouse?: boolean
    reference?: boolean
    city?: boolean
    register?: boolean | Address$registerArgs<ExtArgs>
    _count?: boolean | AddressCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["address"]>



  export type AddressSelectScalar = {
    id?: boolean
    street?: boolean
    neighborhood?: boolean
    numberHouse?: boolean
    reference?: boolean
    city?: boolean
  }

  export type AddressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "street" | "neighborhood" | "numberHouse" | "reference" | "city", ExtArgs["result"]["address"]>
  export type AddressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    register?: boolean | Address$registerArgs<ExtArgs>
    _count?: boolean | AddressCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $AddressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Address"
    objects: {
      register: Prisma.$RegisterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      street: string
      neighborhood: string
      numberHouse: number
      reference: string
      city: string
    }, ExtArgs["result"]["address"]>
    composites: {}
  }

  type AddressGetPayload<S extends boolean | null | undefined | AddressDefaultArgs> = $Result.GetResult<Prisma.$AddressPayload, S>

  type AddressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AddressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AddressCountAggregateInputType | true
    }

  export interface AddressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Address'], meta: { name: 'Address' } }
    /**
     * Find zero or one Address that matches the filter.
     * @param {AddressFindUniqueArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AddressFindUniqueArgs>(args: SelectSubset<T, AddressFindUniqueArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Address that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AddressFindUniqueOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AddressFindUniqueOrThrowArgs>(args: SelectSubset<T, AddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Address that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AddressFindFirstArgs>(args?: SelectSubset<T, AddressFindFirstArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Address that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AddressFindFirstOrThrowArgs>(args?: SelectSubset<T, AddressFindFirstOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Addresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Addresses
     * const addresses = await prisma.address.findMany()
     * 
     * // Get first 10 Addresses
     * const addresses = await prisma.address.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const addressWithIdOnly = await prisma.address.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AddressFindManyArgs>(args?: SelectSubset<T, AddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Address.
     * @param {AddressCreateArgs} args - Arguments to create a Address.
     * @example
     * // Create one Address
     * const Address = await prisma.address.create({
     *   data: {
     *     // ... data to create a Address
     *   }
     * })
     * 
     */
    create<T extends AddressCreateArgs>(args: SelectSubset<T, AddressCreateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Addresses.
     * @param {AddressCreateManyArgs} args - Arguments to create many Addresses.
     * @example
     * // Create many Addresses
     * const address = await prisma.address.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AddressCreateManyArgs>(args?: SelectSubset<T, AddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Address.
     * @param {AddressDeleteArgs} args - Arguments to delete one Address.
     * @example
     * // Delete one Address
     * const Address = await prisma.address.delete({
     *   where: {
     *     // ... filter to delete one Address
     *   }
     * })
     * 
     */
    delete<T extends AddressDeleteArgs>(args: SelectSubset<T, AddressDeleteArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Address.
     * @param {AddressUpdateArgs} args - Arguments to update one Address.
     * @example
     * // Update one Address
     * const address = await prisma.address.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AddressUpdateArgs>(args: SelectSubset<T, AddressUpdateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Addresses.
     * @param {AddressDeleteManyArgs} args - Arguments to filter Addresses to delete.
     * @example
     * // Delete a few Addresses
     * const { count } = await prisma.address.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AddressDeleteManyArgs>(args?: SelectSubset<T, AddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Addresses
     * const address = await prisma.address.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AddressUpdateManyArgs>(args: SelectSubset<T, AddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Address.
     * @param {AddressUpsertArgs} args - Arguments to update or create a Address.
     * @example
     * // Update or create a Address
     * const address = await prisma.address.upsert({
     *   create: {
     *     // ... data to create a Address
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Address we want to update
     *   }
     * })
     */
    upsert<T extends AddressUpsertArgs>(args: SelectSubset<T, AddressUpsertArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressCountArgs} args - Arguments to filter Addresses to count.
     * @example
     * // Count the number of Addresses
     * const count = await prisma.address.count({
     *   where: {
     *     // ... the filter for the Addresses we want to count
     *   }
     * })
    **/
    count<T extends AddressCountArgs>(
      args?: Subset<T, AddressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AddressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AddressAggregateArgs>(args: Subset<T, AddressAggregateArgs>): Prisma.PrismaPromise<GetAddressAggregateType<T>>

    /**
     * Group by Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AddressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AddressGroupByArgs['orderBy'] }
        : { orderBy?: AddressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Address model
   */
  readonly fields: AddressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Address.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AddressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    register<T extends Address$registerArgs<ExtArgs> = {}>(args?: Subset<T, Address$registerArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Address model
   */
  interface AddressFieldRefs {
    readonly id: FieldRef<"Address", 'Int'>
    readonly street: FieldRef<"Address", 'String'>
    readonly neighborhood: FieldRef<"Address", 'String'>
    readonly numberHouse: FieldRef<"Address", 'Int'>
    readonly reference: FieldRef<"Address", 'String'>
    readonly city: FieldRef<"Address", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Address findUnique
   */
  export type AddressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findUniqueOrThrow
   */
  export type AddressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findFirst
   */
  export type AddressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findFirstOrThrow
   */
  export type AddressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findMany
   */
  export type AddressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Addresses to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address create
   */
  export type AddressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to create a Address.
     */
    data: XOR<AddressCreateInput, AddressUncheckedCreateInput>
  }

  /**
   * Address createMany
   */
  export type AddressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Addresses.
     */
    data: AddressCreateManyInput | AddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Address update
   */
  export type AddressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to update a Address.
     */
    data: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
    /**
     * Choose, which Address to update.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address updateMany
   */
  export type AddressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Addresses.
     */
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyInput>
    /**
     * Filter which Addresses to update
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to update.
     */
    limit?: number
  }

  /**
   * Address upsert
   */
  export type AddressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The filter to search for the Address to update in case it exists.
     */
    where: AddressWhereUniqueInput
    /**
     * In case the Address found by the `where` argument doesn't exist, create a new Address with this data.
     */
    create: XOR<AddressCreateInput, AddressUncheckedCreateInput>
    /**
     * In case the Address was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
  }

  /**
   * Address delete
   */
  export type AddressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter which Address to delete.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address deleteMany
   */
  export type AddressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Addresses to delete
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to delete.
     */
    limit?: number
  }

  /**
   * Address.register
   */
  export type Address$registerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    where?: RegisterWhereInput
    orderBy?: RegisterOrderByWithRelationInput | RegisterOrderByWithRelationInput[]
    cursor?: RegisterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RegisterScalarFieldEnum | RegisterScalarFieldEnum[]
  }

  /**
   * Address without action
   */
  export type AddressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
  }


  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _avg: ClientAvgAggregateOutputType | null
    _sum: ClientSumAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientAvgAggregateOutputType = {
    id: number | null
  }

  export type ClientSumAggregateOutputType = {
    id: number | null
  }

  export type ClientMinAggregateOutputType = {
    id: number | null
    name: string | null
    lastName: string | null
    phone: string | null
  }

  export type ClientMaxAggregateOutputType = {
    id: number | null
    name: string | null
    lastName: string | null
    phone: string | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    name: number
    lastName: number
    phone: number
    _all: number
  }


  export type ClientAvgAggregateInputType = {
    id?: true
  }

  export type ClientSumAggregateInputType = {
    id?: true
  }

  export type ClientMinAggregateInputType = {
    id?: true
    name?: true
    lastName?: true
    phone?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    name?: true
    lastName?: true
    phone?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    name?: true
    lastName?: true
    phone?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClientAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClientSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _avg?: ClientAvgAggregateInputType
    _sum?: ClientSumAggregateInputType
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: number
    name: string
    lastName: string
    phone: string
    _count: ClientCountAggregateOutputType | null
    _avg: ClientAvgAggregateOutputType | null
    _sum: ClientSumAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    lastName?: boolean
    phone?: boolean
    register?: boolean | Client$registerArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>



  export type ClientSelectScalar = {
    id?: boolean
    name?: boolean
    lastName?: boolean
    phone?: boolean
  }

  export type ClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "lastName" | "phone", ExtArgs["result"]["client"]>
  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    register?: boolean | Client$registerArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      register: Prisma.$RegisterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      lastName: string
      phone: string
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    register<T extends Client$registerArgs<ExtArgs> = {}>(args?: Subset<T, Client$registerArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Client model
   */
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'Int'>
    readonly name: FieldRef<"Client", 'String'>
    readonly lastName: FieldRef<"Client", 'String'>
    readonly phone: FieldRef<"Client", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to delete.
     */
    limit?: number
  }

  /**
   * Client.register
   */
  export type Client$registerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    where?: RegisterWhereInput
    orderBy?: RegisterOrderByWithRelationInput | RegisterOrderByWithRelationInput[]
    cursor?: RegisterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RegisterScalarFieldEnum | RegisterScalarFieldEnum[]
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model Orderdelivery
   */

  export type AggregateOrderdelivery = {
    _count: OrderdeliveryCountAggregateOutputType | null
    _avg: OrderdeliveryAvgAggregateOutputType | null
    _sum: OrderdeliverySumAggregateOutputType | null
    _min: OrderdeliveryMinAggregateOutputType | null
    _max: OrderdeliveryMaxAggregateOutputType | null
  }

  export type OrderdeliveryAvgAggregateOutputType = {
    id: number | null
    registerId: number | null
    amount: number | null
  }

  export type OrderdeliverySumAggregateOutputType = {
    id: number | null
    registerId: number | null
    amount: number | null
  }

  export type OrderdeliveryMinAggregateOutputType = {
    id: number | null
    registerId: number | null
    quantity: string | null
    amount: number | null
    data: Date | null
  }

  export type OrderdeliveryMaxAggregateOutputType = {
    id: number | null
    registerId: number | null
    quantity: string | null
    amount: number | null
    data: Date | null
  }

  export type OrderdeliveryCountAggregateOutputType = {
    id: number
    registerId: number
    quantity: number
    amount: number
    data: number
    _all: number
  }


  export type OrderdeliveryAvgAggregateInputType = {
    id?: true
    registerId?: true
    amount?: true
  }

  export type OrderdeliverySumAggregateInputType = {
    id?: true
    registerId?: true
    amount?: true
  }

  export type OrderdeliveryMinAggregateInputType = {
    id?: true
    registerId?: true
    quantity?: true
    amount?: true
    data?: true
  }

  export type OrderdeliveryMaxAggregateInputType = {
    id?: true
    registerId?: true
    quantity?: true
    amount?: true
    data?: true
  }

  export type OrderdeliveryCountAggregateInputType = {
    id?: true
    registerId?: true
    quantity?: true
    amount?: true
    data?: true
    _all?: true
  }

  export type OrderdeliveryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orderdelivery to aggregate.
     */
    where?: OrderdeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orderdeliveries to fetch.
     */
    orderBy?: OrderdeliveryOrderByWithRelationInput | OrderdeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderdeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orderdeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orderdeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orderdeliveries
    **/
    _count?: true | OrderdeliveryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderdeliveryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderdeliverySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderdeliveryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderdeliveryMaxAggregateInputType
  }

  export type GetOrderdeliveryAggregateType<T extends OrderdeliveryAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderdelivery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderdelivery[P]>
      : GetScalarType<T[P], AggregateOrderdelivery[P]>
  }




  export type OrderdeliveryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderdeliveryWhereInput
    orderBy?: OrderdeliveryOrderByWithAggregationInput | OrderdeliveryOrderByWithAggregationInput[]
    by: OrderdeliveryScalarFieldEnum[] | OrderdeliveryScalarFieldEnum
    having?: OrderdeliveryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderdeliveryCountAggregateInputType | true
    _avg?: OrderdeliveryAvgAggregateInputType
    _sum?: OrderdeliverySumAggregateInputType
    _min?: OrderdeliveryMinAggregateInputType
    _max?: OrderdeliveryMaxAggregateInputType
  }

  export type OrderdeliveryGroupByOutputType = {
    id: number
    registerId: number
    quantity: string
    amount: number
    data: Date
    _count: OrderdeliveryCountAggregateOutputType | null
    _avg: OrderdeliveryAvgAggregateOutputType | null
    _sum: OrderdeliverySumAggregateOutputType | null
    _min: OrderdeliveryMinAggregateOutputType | null
    _max: OrderdeliveryMaxAggregateOutputType | null
  }

  type GetOrderdeliveryGroupByPayload<T extends OrderdeliveryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderdeliveryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderdeliveryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderdeliveryGroupByOutputType[P]>
            : GetScalarType<T[P], OrderdeliveryGroupByOutputType[P]>
        }
      >
    >


  export type OrderdeliverySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    registerId?: boolean
    quantity?: boolean
    amount?: boolean
    data?: boolean
    register?: boolean | RegisterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderdelivery"]>



  export type OrderdeliverySelectScalar = {
    id?: boolean
    registerId?: boolean
    quantity?: boolean
    amount?: boolean
    data?: boolean
  }

  export type OrderdeliveryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "registerId" | "quantity" | "amount" | "data", ExtArgs["result"]["orderdelivery"]>
  export type OrderdeliveryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    register?: boolean | RegisterDefaultArgs<ExtArgs>
  }

  export type $OrderdeliveryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Orderdelivery"
    objects: {
      register: Prisma.$RegisterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      registerId: number
      quantity: string
      amount: number
      data: Date
    }, ExtArgs["result"]["orderdelivery"]>
    composites: {}
  }

  type OrderdeliveryGetPayload<S extends boolean | null | undefined | OrderdeliveryDefaultArgs> = $Result.GetResult<Prisma.$OrderdeliveryPayload, S>

  type OrderdeliveryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderdeliveryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderdeliveryCountAggregateInputType | true
    }

  export interface OrderdeliveryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Orderdelivery'], meta: { name: 'Orderdelivery' } }
    /**
     * Find zero or one Orderdelivery that matches the filter.
     * @param {OrderdeliveryFindUniqueArgs} args - Arguments to find a Orderdelivery
     * @example
     * // Get one Orderdelivery
     * const orderdelivery = await prisma.orderdelivery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderdeliveryFindUniqueArgs>(args: SelectSubset<T, OrderdeliveryFindUniqueArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Orderdelivery that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderdeliveryFindUniqueOrThrowArgs} args - Arguments to find a Orderdelivery
     * @example
     * // Get one Orderdelivery
     * const orderdelivery = await prisma.orderdelivery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderdeliveryFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderdeliveryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Orderdelivery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderdeliveryFindFirstArgs} args - Arguments to find a Orderdelivery
     * @example
     * // Get one Orderdelivery
     * const orderdelivery = await prisma.orderdelivery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderdeliveryFindFirstArgs>(args?: SelectSubset<T, OrderdeliveryFindFirstArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Orderdelivery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderdeliveryFindFirstOrThrowArgs} args - Arguments to find a Orderdelivery
     * @example
     * // Get one Orderdelivery
     * const orderdelivery = await prisma.orderdelivery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderdeliveryFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderdeliveryFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Orderdeliveries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderdeliveryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orderdeliveries
     * const orderdeliveries = await prisma.orderdelivery.findMany()
     * 
     * // Get first 10 Orderdeliveries
     * const orderdeliveries = await prisma.orderdelivery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderdeliveryWithIdOnly = await prisma.orderdelivery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderdeliveryFindManyArgs>(args?: SelectSubset<T, OrderdeliveryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Orderdelivery.
     * @param {OrderdeliveryCreateArgs} args - Arguments to create a Orderdelivery.
     * @example
     * // Create one Orderdelivery
     * const Orderdelivery = await prisma.orderdelivery.create({
     *   data: {
     *     // ... data to create a Orderdelivery
     *   }
     * })
     * 
     */
    create<T extends OrderdeliveryCreateArgs>(args: SelectSubset<T, OrderdeliveryCreateArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Orderdeliveries.
     * @param {OrderdeliveryCreateManyArgs} args - Arguments to create many Orderdeliveries.
     * @example
     * // Create many Orderdeliveries
     * const orderdelivery = await prisma.orderdelivery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderdeliveryCreateManyArgs>(args?: SelectSubset<T, OrderdeliveryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Orderdelivery.
     * @param {OrderdeliveryDeleteArgs} args - Arguments to delete one Orderdelivery.
     * @example
     * // Delete one Orderdelivery
     * const Orderdelivery = await prisma.orderdelivery.delete({
     *   where: {
     *     // ... filter to delete one Orderdelivery
     *   }
     * })
     * 
     */
    delete<T extends OrderdeliveryDeleteArgs>(args: SelectSubset<T, OrderdeliveryDeleteArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Orderdelivery.
     * @param {OrderdeliveryUpdateArgs} args - Arguments to update one Orderdelivery.
     * @example
     * // Update one Orderdelivery
     * const orderdelivery = await prisma.orderdelivery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderdeliveryUpdateArgs>(args: SelectSubset<T, OrderdeliveryUpdateArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Orderdeliveries.
     * @param {OrderdeliveryDeleteManyArgs} args - Arguments to filter Orderdeliveries to delete.
     * @example
     * // Delete a few Orderdeliveries
     * const { count } = await prisma.orderdelivery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderdeliveryDeleteManyArgs>(args?: SelectSubset<T, OrderdeliveryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orderdeliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderdeliveryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orderdeliveries
     * const orderdelivery = await prisma.orderdelivery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderdeliveryUpdateManyArgs>(args: SelectSubset<T, OrderdeliveryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Orderdelivery.
     * @param {OrderdeliveryUpsertArgs} args - Arguments to update or create a Orderdelivery.
     * @example
     * // Update or create a Orderdelivery
     * const orderdelivery = await prisma.orderdelivery.upsert({
     *   create: {
     *     // ... data to create a Orderdelivery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Orderdelivery we want to update
     *   }
     * })
     */
    upsert<T extends OrderdeliveryUpsertArgs>(args: SelectSubset<T, OrderdeliveryUpsertArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Orderdeliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderdeliveryCountArgs} args - Arguments to filter Orderdeliveries to count.
     * @example
     * // Count the number of Orderdeliveries
     * const count = await prisma.orderdelivery.count({
     *   where: {
     *     // ... the filter for the Orderdeliveries we want to count
     *   }
     * })
    **/
    count<T extends OrderdeliveryCountArgs>(
      args?: Subset<T, OrderdeliveryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderdeliveryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Orderdelivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderdeliveryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderdeliveryAggregateArgs>(args: Subset<T, OrderdeliveryAggregateArgs>): Prisma.PrismaPromise<GetOrderdeliveryAggregateType<T>>

    /**
     * Group by Orderdelivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderdeliveryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderdeliveryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderdeliveryGroupByArgs['orderBy'] }
        : { orderBy?: OrderdeliveryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderdeliveryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderdeliveryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Orderdelivery model
   */
  readonly fields: OrderdeliveryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Orderdelivery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderdeliveryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    register<T extends RegisterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RegisterDefaultArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Orderdelivery model
   */
  interface OrderdeliveryFieldRefs {
    readonly id: FieldRef<"Orderdelivery", 'Int'>
    readonly registerId: FieldRef<"Orderdelivery", 'Int'>
    readonly quantity: FieldRef<"Orderdelivery", 'String'>
    readonly amount: FieldRef<"Orderdelivery", 'Float'>
    readonly data: FieldRef<"Orderdelivery", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Orderdelivery findUnique
   */
  export type OrderdeliveryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Orderdelivery to fetch.
     */
    where: OrderdeliveryWhereUniqueInput
  }

  /**
   * Orderdelivery findUniqueOrThrow
   */
  export type OrderdeliveryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Orderdelivery to fetch.
     */
    where: OrderdeliveryWhereUniqueInput
  }

  /**
   * Orderdelivery findFirst
   */
  export type OrderdeliveryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Orderdelivery to fetch.
     */
    where?: OrderdeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orderdeliveries to fetch.
     */
    orderBy?: OrderdeliveryOrderByWithRelationInput | OrderdeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orderdeliveries.
     */
    cursor?: OrderdeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orderdeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orderdeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orderdeliveries.
     */
    distinct?: OrderdeliveryScalarFieldEnum | OrderdeliveryScalarFieldEnum[]
  }

  /**
   * Orderdelivery findFirstOrThrow
   */
  export type OrderdeliveryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Orderdelivery to fetch.
     */
    where?: OrderdeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orderdeliveries to fetch.
     */
    orderBy?: OrderdeliveryOrderByWithRelationInput | OrderdeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orderdeliveries.
     */
    cursor?: OrderdeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orderdeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orderdeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orderdeliveries.
     */
    distinct?: OrderdeliveryScalarFieldEnum | OrderdeliveryScalarFieldEnum[]
  }

  /**
   * Orderdelivery findMany
   */
  export type OrderdeliveryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Orderdeliveries to fetch.
     */
    where?: OrderdeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orderdeliveries to fetch.
     */
    orderBy?: OrderdeliveryOrderByWithRelationInput | OrderdeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orderdeliveries.
     */
    cursor?: OrderdeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orderdeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orderdeliveries.
     */
    skip?: number
    distinct?: OrderdeliveryScalarFieldEnum | OrderdeliveryScalarFieldEnum[]
  }

  /**
   * Orderdelivery create
   */
  export type OrderdeliveryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * The data needed to create a Orderdelivery.
     */
    data: XOR<OrderdeliveryCreateInput, OrderdeliveryUncheckedCreateInput>
  }

  /**
   * Orderdelivery createMany
   */
  export type OrderdeliveryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orderdeliveries.
     */
    data: OrderdeliveryCreateManyInput | OrderdeliveryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Orderdelivery update
   */
  export type OrderdeliveryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * The data needed to update a Orderdelivery.
     */
    data: XOR<OrderdeliveryUpdateInput, OrderdeliveryUncheckedUpdateInput>
    /**
     * Choose, which Orderdelivery to update.
     */
    where: OrderdeliveryWhereUniqueInput
  }

  /**
   * Orderdelivery updateMany
   */
  export type OrderdeliveryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orderdeliveries.
     */
    data: XOR<OrderdeliveryUpdateManyMutationInput, OrderdeliveryUncheckedUpdateManyInput>
    /**
     * Filter which Orderdeliveries to update
     */
    where?: OrderdeliveryWhereInput
    /**
     * Limit how many Orderdeliveries to update.
     */
    limit?: number
  }

  /**
   * Orderdelivery upsert
   */
  export type OrderdeliveryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * The filter to search for the Orderdelivery to update in case it exists.
     */
    where: OrderdeliveryWhereUniqueInput
    /**
     * In case the Orderdelivery found by the `where` argument doesn't exist, create a new Orderdelivery with this data.
     */
    create: XOR<OrderdeliveryCreateInput, OrderdeliveryUncheckedCreateInput>
    /**
     * In case the Orderdelivery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderdeliveryUpdateInput, OrderdeliveryUncheckedUpdateInput>
  }

  /**
   * Orderdelivery delete
   */
  export type OrderdeliveryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    /**
     * Filter which Orderdelivery to delete.
     */
    where: OrderdeliveryWhereUniqueInput
  }

  /**
   * Orderdelivery deleteMany
   */
  export type OrderdeliveryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orderdeliveries to delete
     */
    where?: OrderdeliveryWhereInput
    /**
     * Limit how many Orderdeliveries to delete.
     */
    limit?: number
  }

  /**
   * Orderdelivery without action
   */
  export type OrderdeliveryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
  }


  /**
   * Model Register
   */

  export type AggregateRegister = {
    _count: RegisterCountAggregateOutputType | null
    _avg: RegisterAvgAggregateOutputType | null
    _sum: RegisterSumAggregateOutputType | null
    _min: RegisterMinAggregateOutputType | null
    _max: RegisterMaxAggregateOutputType | null
  }

  export type RegisterAvgAggregateOutputType = {
    id: number | null
    clientId: number | null
    addressId: number | null
  }

  export type RegisterSumAggregateOutputType = {
    id: number | null
    clientId: number | null
    addressId: number | null
  }

  export type RegisterMinAggregateOutputType = {
    id: number | null
    clientId: number | null
    addressId: number | null
  }

  export type RegisterMaxAggregateOutputType = {
    id: number | null
    clientId: number | null
    addressId: number | null
  }

  export type RegisterCountAggregateOutputType = {
    id: number
    clientId: number
    addressId: number
    _all: number
  }


  export type RegisterAvgAggregateInputType = {
    id?: true
    clientId?: true
    addressId?: true
  }

  export type RegisterSumAggregateInputType = {
    id?: true
    clientId?: true
    addressId?: true
  }

  export type RegisterMinAggregateInputType = {
    id?: true
    clientId?: true
    addressId?: true
  }

  export type RegisterMaxAggregateInputType = {
    id?: true
    clientId?: true
    addressId?: true
  }

  export type RegisterCountAggregateInputType = {
    id?: true
    clientId?: true
    addressId?: true
    _all?: true
  }

  export type RegisterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Register to aggregate.
     */
    where?: RegisterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Registers to fetch.
     */
    orderBy?: RegisterOrderByWithRelationInput | RegisterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RegisterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Registers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Registers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Registers
    **/
    _count?: true | RegisterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RegisterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RegisterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RegisterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RegisterMaxAggregateInputType
  }

  export type GetRegisterAggregateType<T extends RegisterAggregateArgs> = {
        [P in keyof T & keyof AggregateRegister]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRegister[P]>
      : GetScalarType<T[P], AggregateRegister[P]>
  }




  export type RegisterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegisterWhereInput
    orderBy?: RegisterOrderByWithAggregationInput | RegisterOrderByWithAggregationInput[]
    by: RegisterScalarFieldEnum[] | RegisterScalarFieldEnum
    having?: RegisterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RegisterCountAggregateInputType | true
    _avg?: RegisterAvgAggregateInputType
    _sum?: RegisterSumAggregateInputType
    _min?: RegisterMinAggregateInputType
    _max?: RegisterMaxAggregateInputType
  }

  export type RegisterGroupByOutputType = {
    id: number
    clientId: number
    addressId: number
    _count: RegisterCountAggregateOutputType | null
    _avg: RegisterAvgAggregateOutputType | null
    _sum: RegisterSumAggregateOutputType | null
    _min: RegisterMinAggregateOutputType | null
    _max: RegisterMaxAggregateOutputType | null
  }

  type GetRegisterGroupByPayload<T extends RegisterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RegisterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RegisterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RegisterGroupByOutputType[P]>
            : GetScalarType<T[P], RegisterGroupByOutputType[P]>
        }
      >
    >


  export type RegisterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    addressId?: boolean
    orderdelivery?: boolean | Register$orderdeliveryArgs<ExtArgs>
    address?: boolean | AddressDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["register"]>



  export type RegisterSelectScalar = {
    id?: boolean
    clientId?: boolean
    addressId?: boolean
  }

  export type RegisterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientId" | "addressId", ExtArgs["result"]["register"]>
  export type RegisterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orderdelivery?: boolean | Register$orderdeliveryArgs<ExtArgs>
    address?: boolean | AddressDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }

  export type $RegisterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Register"
    objects: {
      orderdelivery: Prisma.$OrderdeliveryPayload<ExtArgs> | null
      address: Prisma.$AddressPayload<ExtArgs>
      client: Prisma.$ClientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      clientId: number
      addressId: number
    }, ExtArgs["result"]["register"]>
    composites: {}
  }

  type RegisterGetPayload<S extends boolean | null | undefined | RegisterDefaultArgs> = $Result.GetResult<Prisma.$RegisterPayload, S>

  type RegisterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RegisterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RegisterCountAggregateInputType | true
    }

  export interface RegisterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Register'], meta: { name: 'Register' } }
    /**
     * Find zero or one Register that matches the filter.
     * @param {RegisterFindUniqueArgs} args - Arguments to find a Register
     * @example
     * // Get one Register
     * const register = await prisma.register.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegisterFindUniqueArgs>(args: SelectSubset<T, RegisterFindUniqueArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Register that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegisterFindUniqueOrThrowArgs} args - Arguments to find a Register
     * @example
     * // Get one Register
     * const register = await prisma.register.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegisterFindUniqueOrThrowArgs>(args: SelectSubset<T, RegisterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Register that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterFindFirstArgs} args - Arguments to find a Register
     * @example
     * // Get one Register
     * const register = await prisma.register.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegisterFindFirstArgs>(args?: SelectSubset<T, RegisterFindFirstArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Register that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterFindFirstOrThrowArgs} args - Arguments to find a Register
     * @example
     * // Get one Register
     * const register = await prisma.register.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegisterFindFirstOrThrowArgs>(args?: SelectSubset<T, RegisterFindFirstOrThrowArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Registers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Registers
     * const registers = await prisma.register.findMany()
     * 
     * // Get first 10 Registers
     * const registers = await prisma.register.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const registerWithIdOnly = await prisma.register.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RegisterFindManyArgs>(args?: SelectSubset<T, RegisterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Register.
     * @param {RegisterCreateArgs} args - Arguments to create a Register.
     * @example
     * // Create one Register
     * const Register = await prisma.register.create({
     *   data: {
     *     // ... data to create a Register
     *   }
     * })
     * 
     */
    create<T extends RegisterCreateArgs>(args: SelectSubset<T, RegisterCreateArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Registers.
     * @param {RegisterCreateManyArgs} args - Arguments to create many Registers.
     * @example
     * // Create many Registers
     * const register = await prisma.register.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RegisterCreateManyArgs>(args?: SelectSubset<T, RegisterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Register.
     * @param {RegisterDeleteArgs} args - Arguments to delete one Register.
     * @example
     * // Delete one Register
     * const Register = await prisma.register.delete({
     *   where: {
     *     // ... filter to delete one Register
     *   }
     * })
     * 
     */
    delete<T extends RegisterDeleteArgs>(args: SelectSubset<T, RegisterDeleteArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Register.
     * @param {RegisterUpdateArgs} args - Arguments to update one Register.
     * @example
     * // Update one Register
     * const register = await prisma.register.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RegisterUpdateArgs>(args: SelectSubset<T, RegisterUpdateArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Registers.
     * @param {RegisterDeleteManyArgs} args - Arguments to filter Registers to delete.
     * @example
     * // Delete a few Registers
     * const { count } = await prisma.register.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RegisterDeleteManyArgs>(args?: SelectSubset<T, RegisterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Registers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Registers
     * const register = await prisma.register.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RegisterUpdateManyArgs>(args: SelectSubset<T, RegisterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Register.
     * @param {RegisterUpsertArgs} args - Arguments to update or create a Register.
     * @example
     * // Update or create a Register
     * const register = await prisma.register.upsert({
     *   create: {
     *     // ... data to create a Register
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Register we want to update
     *   }
     * })
     */
    upsert<T extends RegisterUpsertArgs>(args: SelectSubset<T, RegisterUpsertArgs<ExtArgs>>): Prisma__RegisterClient<$Result.GetResult<Prisma.$RegisterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Registers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterCountArgs} args - Arguments to filter Registers to count.
     * @example
     * // Count the number of Registers
     * const count = await prisma.register.count({
     *   where: {
     *     // ... the filter for the Registers we want to count
     *   }
     * })
    **/
    count<T extends RegisterCountArgs>(
      args?: Subset<T, RegisterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RegisterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Register.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RegisterAggregateArgs>(args: Subset<T, RegisterAggregateArgs>): Prisma.PrismaPromise<GetRegisterAggregateType<T>>

    /**
     * Group by Register.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RegisterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RegisterGroupByArgs['orderBy'] }
        : { orderBy?: RegisterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RegisterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegisterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Register model
   */
  readonly fields: RegisterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Register.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RegisterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orderdelivery<T extends Register$orderdeliveryArgs<ExtArgs> = {}>(args?: Subset<T, Register$orderdeliveryArgs<ExtArgs>>): Prisma__OrderdeliveryClient<$Result.GetResult<Prisma.$OrderdeliveryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    address<T extends AddressDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AddressDefaultArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Register model
   */
  interface RegisterFieldRefs {
    readonly id: FieldRef<"Register", 'Int'>
    readonly clientId: FieldRef<"Register", 'Int'>
    readonly addressId: FieldRef<"Register", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Register findUnique
   */
  export type RegisterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * Filter, which Register to fetch.
     */
    where: RegisterWhereUniqueInput
  }

  /**
   * Register findUniqueOrThrow
   */
  export type RegisterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * Filter, which Register to fetch.
     */
    where: RegisterWhereUniqueInput
  }

  /**
   * Register findFirst
   */
  export type RegisterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * Filter, which Register to fetch.
     */
    where?: RegisterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Registers to fetch.
     */
    orderBy?: RegisterOrderByWithRelationInput | RegisterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Registers.
     */
    cursor?: RegisterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Registers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Registers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Registers.
     */
    distinct?: RegisterScalarFieldEnum | RegisterScalarFieldEnum[]
  }

  /**
   * Register findFirstOrThrow
   */
  export type RegisterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * Filter, which Register to fetch.
     */
    where?: RegisterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Registers to fetch.
     */
    orderBy?: RegisterOrderByWithRelationInput | RegisterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Registers.
     */
    cursor?: RegisterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Registers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Registers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Registers.
     */
    distinct?: RegisterScalarFieldEnum | RegisterScalarFieldEnum[]
  }

  /**
   * Register findMany
   */
  export type RegisterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * Filter, which Registers to fetch.
     */
    where?: RegisterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Registers to fetch.
     */
    orderBy?: RegisterOrderByWithRelationInput | RegisterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Registers.
     */
    cursor?: RegisterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Registers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Registers.
     */
    skip?: number
    distinct?: RegisterScalarFieldEnum | RegisterScalarFieldEnum[]
  }

  /**
   * Register create
   */
  export type RegisterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * The data needed to create a Register.
     */
    data: XOR<RegisterCreateInput, RegisterUncheckedCreateInput>
  }

  /**
   * Register createMany
   */
  export type RegisterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Registers.
     */
    data: RegisterCreateManyInput | RegisterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Register update
   */
  export type RegisterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * The data needed to update a Register.
     */
    data: XOR<RegisterUpdateInput, RegisterUncheckedUpdateInput>
    /**
     * Choose, which Register to update.
     */
    where: RegisterWhereUniqueInput
  }

  /**
   * Register updateMany
   */
  export type RegisterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Registers.
     */
    data: XOR<RegisterUpdateManyMutationInput, RegisterUncheckedUpdateManyInput>
    /**
     * Filter which Registers to update
     */
    where?: RegisterWhereInput
    /**
     * Limit how many Registers to update.
     */
    limit?: number
  }

  /**
   * Register upsert
   */
  export type RegisterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * The filter to search for the Register to update in case it exists.
     */
    where: RegisterWhereUniqueInput
    /**
     * In case the Register found by the `where` argument doesn't exist, create a new Register with this data.
     */
    create: XOR<RegisterCreateInput, RegisterUncheckedCreateInput>
    /**
     * In case the Register was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RegisterUpdateInput, RegisterUncheckedUpdateInput>
  }

  /**
   * Register delete
   */
  export type RegisterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
    /**
     * Filter which Register to delete.
     */
    where: RegisterWhereUniqueInput
  }

  /**
   * Register deleteMany
   */
  export type RegisterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Registers to delete
     */
    where?: RegisterWhereInput
    /**
     * Limit how many Registers to delete.
     */
    limit?: number
  }

  /**
   * Register.orderdelivery
   */
  export type Register$orderdeliveryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orderdelivery
     */
    select?: OrderdeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Orderdelivery
     */
    omit?: OrderdeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderdeliveryInclude<ExtArgs> | null
    where?: OrderdeliveryWhereInput
  }

  /**
   * Register without action
   */
  export type RegisterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Register
     */
    select?: RegisterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Register
     */
    omit?: RegisterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AddressScalarFieldEnum: {
    id: 'id',
    street: 'street',
    neighborhood: 'neighborhood',
    numberHouse: 'numberHouse',
    reference: 'reference',
    city: 'city'
  };

  export type AddressScalarFieldEnum = (typeof AddressScalarFieldEnum)[keyof typeof AddressScalarFieldEnum]


  export const ClientScalarFieldEnum: {
    id: 'id',
    name: 'name',
    lastName: 'lastName',
    phone: 'phone'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const OrderdeliveryScalarFieldEnum: {
    id: 'id',
    registerId: 'registerId',
    quantity: 'quantity',
    amount: 'amount',
    data: 'data'
  };

  export type OrderdeliveryScalarFieldEnum = (typeof OrderdeliveryScalarFieldEnum)[keyof typeof OrderdeliveryScalarFieldEnum]


  export const RegisterScalarFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    addressId: 'addressId'
  };

  export type RegisterScalarFieldEnum = (typeof RegisterScalarFieldEnum)[keyof typeof RegisterScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const AddressOrderByRelevanceFieldEnum: {
    street: 'street',
    neighborhood: 'neighborhood',
    reference: 'reference',
    city: 'city'
  };

  export type AddressOrderByRelevanceFieldEnum = (typeof AddressOrderByRelevanceFieldEnum)[keyof typeof AddressOrderByRelevanceFieldEnum]


  export const ClientOrderByRelevanceFieldEnum: {
    name: 'name',
    lastName: 'lastName',
    phone: 'phone'
  };

  export type ClientOrderByRelevanceFieldEnum = (typeof ClientOrderByRelevanceFieldEnum)[keyof typeof ClientOrderByRelevanceFieldEnum]


  export const OrderdeliveryOrderByRelevanceFieldEnum: {
    quantity: 'quantity'
  };

  export type OrderdeliveryOrderByRelevanceFieldEnum = (typeof OrderdeliveryOrderByRelevanceFieldEnum)[keyof typeof OrderdeliveryOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    
  /**
   * Deep Input Types
   */


  export type AddressWhereInput = {
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    id?: IntFilter<"Address"> | number
    street?: StringFilter<"Address"> | string
    neighborhood?: StringFilter<"Address"> | string
    numberHouse?: IntFilter<"Address"> | number
    reference?: StringFilter<"Address"> | string
    city?: StringFilter<"Address"> | string
    register?: RegisterListRelationFilter
  }

  export type AddressOrderByWithRelationInput = {
    id?: SortOrder
    street?: SortOrder
    neighborhood?: SortOrder
    numberHouse?: SortOrder
    reference?: SortOrder
    city?: SortOrder
    register?: RegisterOrderByRelationAggregateInput
    _relevance?: AddressOrderByRelevanceInput
  }

  export type AddressWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    street?: StringFilter<"Address"> | string
    neighborhood?: StringFilter<"Address"> | string
    numberHouse?: IntFilter<"Address"> | number
    reference?: StringFilter<"Address"> | string
    city?: StringFilter<"Address"> | string
    register?: RegisterListRelationFilter
  }, "id">

  export type AddressOrderByWithAggregationInput = {
    id?: SortOrder
    street?: SortOrder
    neighborhood?: SortOrder
    numberHouse?: SortOrder
    reference?: SortOrder
    city?: SortOrder
    _count?: AddressCountOrderByAggregateInput
    _avg?: AddressAvgOrderByAggregateInput
    _max?: AddressMaxOrderByAggregateInput
    _min?: AddressMinOrderByAggregateInput
    _sum?: AddressSumOrderByAggregateInput
  }

  export type AddressScalarWhereWithAggregatesInput = {
    AND?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    OR?: AddressScalarWhereWithAggregatesInput[]
    NOT?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Address"> | number
    street?: StringWithAggregatesFilter<"Address"> | string
    neighborhood?: StringWithAggregatesFilter<"Address"> | string
    numberHouse?: IntWithAggregatesFilter<"Address"> | number
    reference?: StringWithAggregatesFilter<"Address"> | string
    city?: StringWithAggregatesFilter<"Address"> | string
  }

  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: IntFilter<"Client"> | number
    name?: StringFilter<"Client"> | string
    lastName?: StringFilter<"Client"> | string
    phone?: StringFilter<"Client"> | string
    register?: RegisterListRelationFilter
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    register?: RegisterOrderByRelationAggregateInput
    _relevance?: ClientOrderByRelevanceInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    name?: StringFilter<"Client"> | string
    lastName?: StringFilter<"Client"> | string
    phone?: StringFilter<"Client"> | string
    register?: RegisterListRelationFilter
  }, "id">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    _count?: ClientCountOrderByAggregateInput
    _avg?: ClientAvgOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
    _sum?: ClientSumOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Client"> | number
    name?: StringWithAggregatesFilter<"Client"> | string
    lastName?: StringWithAggregatesFilter<"Client"> | string
    phone?: StringWithAggregatesFilter<"Client"> | string
  }

  export type OrderdeliveryWhereInput = {
    AND?: OrderdeliveryWhereInput | OrderdeliveryWhereInput[]
    OR?: OrderdeliveryWhereInput[]
    NOT?: OrderdeliveryWhereInput | OrderdeliveryWhereInput[]
    id?: IntFilter<"Orderdelivery"> | number
    registerId?: IntFilter<"Orderdelivery"> | number
    quantity?: StringFilter<"Orderdelivery"> | string
    amount?: FloatFilter<"Orderdelivery"> | number
    data?: DateTimeFilter<"Orderdelivery"> | Date | string
    register?: XOR<RegisterScalarRelationFilter, RegisterWhereInput>
  }

  export type OrderdeliveryOrderByWithRelationInput = {
    id?: SortOrder
    registerId?: SortOrder
    quantity?: SortOrder
    amount?: SortOrder
    data?: SortOrder
    register?: RegisterOrderByWithRelationInput
    _relevance?: OrderdeliveryOrderByRelevanceInput
  }

  export type OrderdeliveryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    registerId?: number
    AND?: OrderdeliveryWhereInput | OrderdeliveryWhereInput[]
    OR?: OrderdeliveryWhereInput[]
    NOT?: OrderdeliveryWhereInput | OrderdeliveryWhereInput[]
    quantity?: StringFilter<"Orderdelivery"> | string
    amount?: FloatFilter<"Orderdelivery"> | number
    data?: DateTimeFilter<"Orderdelivery"> | Date | string
    register?: XOR<RegisterScalarRelationFilter, RegisterWhereInput>
  }, "id" | "registerId">

  export type OrderdeliveryOrderByWithAggregationInput = {
    id?: SortOrder
    registerId?: SortOrder
    quantity?: SortOrder
    amount?: SortOrder
    data?: SortOrder
    _count?: OrderdeliveryCountOrderByAggregateInput
    _avg?: OrderdeliveryAvgOrderByAggregateInput
    _max?: OrderdeliveryMaxOrderByAggregateInput
    _min?: OrderdeliveryMinOrderByAggregateInput
    _sum?: OrderdeliverySumOrderByAggregateInput
  }

  export type OrderdeliveryScalarWhereWithAggregatesInput = {
    AND?: OrderdeliveryScalarWhereWithAggregatesInput | OrderdeliveryScalarWhereWithAggregatesInput[]
    OR?: OrderdeliveryScalarWhereWithAggregatesInput[]
    NOT?: OrderdeliveryScalarWhereWithAggregatesInput | OrderdeliveryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Orderdelivery"> | number
    registerId?: IntWithAggregatesFilter<"Orderdelivery"> | number
    quantity?: StringWithAggregatesFilter<"Orderdelivery"> | string
    amount?: FloatWithAggregatesFilter<"Orderdelivery"> | number
    data?: DateTimeWithAggregatesFilter<"Orderdelivery"> | Date | string
  }

  export type RegisterWhereInput = {
    AND?: RegisterWhereInput | RegisterWhereInput[]
    OR?: RegisterWhereInput[]
    NOT?: RegisterWhereInput | RegisterWhereInput[]
    id?: IntFilter<"Register"> | number
    clientId?: IntFilter<"Register"> | number
    addressId?: IntFilter<"Register"> | number
    orderdelivery?: XOR<OrderdeliveryNullableScalarRelationFilter, OrderdeliveryWhereInput> | null
    address?: XOR<AddressScalarRelationFilter, AddressWhereInput>
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }

  export type RegisterOrderByWithRelationInput = {
    id?: SortOrder
    clientId?: SortOrder
    addressId?: SortOrder
    orderdelivery?: OrderdeliveryOrderByWithRelationInput
    address?: AddressOrderByWithRelationInput
    client?: ClientOrderByWithRelationInput
  }

  export type RegisterWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RegisterWhereInput | RegisterWhereInput[]
    OR?: RegisterWhereInput[]
    NOT?: RegisterWhereInput | RegisterWhereInput[]
    clientId?: IntFilter<"Register"> | number
    addressId?: IntFilter<"Register"> | number
    orderdelivery?: XOR<OrderdeliveryNullableScalarRelationFilter, OrderdeliveryWhereInput> | null
    address?: XOR<AddressScalarRelationFilter, AddressWhereInput>
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }, "id">

  export type RegisterOrderByWithAggregationInput = {
    id?: SortOrder
    clientId?: SortOrder
    addressId?: SortOrder
    _count?: RegisterCountOrderByAggregateInput
    _avg?: RegisterAvgOrderByAggregateInput
    _max?: RegisterMaxOrderByAggregateInput
    _min?: RegisterMinOrderByAggregateInput
    _sum?: RegisterSumOrderByAggregateInput
  }

  export type RegisterScalarWhereWithAggregatesInput = {
    AND?: RegisterScalarWhereWithAggregatesInput | RegisterScalarWhereWithAggregatesInput[]
    OR?: RegisterScalarWhereWithAggregatesInput[]
    NOT?: RegisterScalarWhereWithAggregatesInput | RegisterScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Register"> | number
    clientId?: IntWithAggregatesFilter<"Register"> | number
    addressId?: IntWithAggregatesFilter<"Register"> | number
  }

  export type AddressCreateInput = {
    street: string
    neighborhood: string
    numberHouse: number
    reference: string
    city: string
    register?: RegisterCreateNestedManyWithoutAddressInput
  }

  export type AddressUncheckedCreateInput = {
    id?: number
    street: string
    neighborhood: string
    numberHouse: number
    reference: string
    city: string
    register?: RegisterUncheckedCreateNestedManyWithoutAddressInput
  }

  export type AddressUpdateInput = {
    street?: StringFieldUpdateOperationsInput | string
    neighborhood?: StringFieldUpdateOperationsInput | string
    numberHouse?: IntFieldUpdateOperationsInput | number
    reference?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    register?: RegisterUpdateManyWithoutAddressNestedInput
  }

  export type AddressUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    street?: StringFieldUpdateOperationsInput | string
    neighborhood?: StringFieldUpdateOperationsInput | string
    numberHouse?: IntFieldUpdateOperationsInput | number
    reference?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    register?: RegisterUncheckedUpdateManyWithoutAddressNestedInput
  }

  export type AddressCreateManyInput = {
    id?: number
    street: string
    neighborhood: string
    numberHouse: number
    reference: string
    city: string
  }

  export type AddressUpdateManyMutationInput = {
    street?: StringFieldUpdateOperationsInput | string
    neighborhood?: StringFieldUpdateOperationsInput | string
    numberHouse?: IntFieldUpdateOperationsInput | number
    reference?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
  }

  export type AddressUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    street?: StringFieldUpdateOperationsInput | string
    neighborhood?: StringFieldUpdateOperationsInput | string
    numberHouse?: IntFieldUpdateOperationsInput | number
    reference?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
  }

  export type ClientCreateInput = {
    name: string
    lastName: string
    phone: string
    register?: RegisterCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateInput = {
    id?: number
    name: string
    lastName: string
    phone: string
    register?: RegisterUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    register?: RegisterUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    register?: RegisterUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateManyInput = {
    id?: number
    name: string
    lastName: string
    phone: string
  }

  export type ClientUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type OrderdeliveryCreateInput = {
    quantity: string
    amount: number
    data: Date | string
    register: RegisterCreateNestedOneWithoutOrderdeliveryInput
  }

  export type OrderdeliveryUncheckedCreateInput = {
    id?: number
    registerId: number
    quantity: string
    amount: number
    data: Date | string
  }

  export type OrderdeliveryUpdateInput = {
    quantity?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    register?: RegisterUpdateOneRequiredWithoutOrderdeliveryNestedInput
  }

  export type OrderdeliveryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    registerId?: IntFieldUpdateOperationsInput | number
    quantity?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderdeliveryCreateManyInput = {
    id?: number
    registerId: number
    quantity: string
    amount: number
    data: Date | string
  }

  export type OrderdeliveryUpdateManyMutationInput = {
    quantity?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderdeliveryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    registerId?: IntFieldUpdateOperationsInput | number
    quantity?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegisterCreateInput = {
    orderdelivery?: OrderdeliveryCreateNestedOneWithoutRegisterInput
    address: AddressCreateNestedOneWithoutRegisterInput
    client: ClientCreateNestedOneWithoutRegisterInput
  }

  export type RegisterUncheckedCreateInput = {
    id?: number
    clientId: number
    addressId: number
    orderdelivery?: OrderdeliveryUncheckedCreateNestedOneWithoutRegisterInput
  }

  export type RegisterUpdateInput = {
    orderdelivery?: OrderdeliveryUpdateOneWithoutRegisterNestedInput
    address?: AddressUpdateOneRequiredWithoutRegisterNestedInput
    client?: ClientUpdateOneRequiredWithoutRegisterNestedInput
  }

  export type RegisterUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    clientId?: IntFieldUpdateOperationsInput | number
    addressId?: IntFieldUpdateOperationsInput | number
    orderdelivery?: OrderdeliveryUncheckedUpdateOneWithoutRegisterNestedInput
  }

  export type RegisterCreateManyInput = {
    id?: number
    clientId: number
    addressId: number
  }

  export type RegisterUpdateManyMutationInput = {

  }

  export type RegisterUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    clientId?: IntFieldUpdateOperationsInput | number
    addressId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type RegisterListRelationFilter = {
    every?: RegisterWhereInput
    some?: RegisterWhereInput
    none?: RegisterWhereInput
  }

  export type RegisterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AddressOrderByRelevanceInput = {
    fields: AddressOrderByRelevanceFieldEnum | AddressOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AddressCountOrderByAggregateInput = {
    id?: SortOrder
    street?: SortOrder
    neighborhood?: SortOrder
    numberHouse?: SortOrder
    reference?: SortOrder
    city?: SortOrder
  }

  export type AddressAvgOrderByAggregateInput = {
    id?: SortOrder
    numberHouse?: SortOrder
  }

  export type AddressMaxOrderByAggregateInput = {
    id?: SortOrder
    street?: SortOrder
    neighborhood?: SortOrder
    numberHouse?: SortOrder
    reference?: SortOrder
    city?: SortOrder
  }

  export type AddressMinOrderByAggregateInput = {
    id?: SortOrder
    street?: SortOrder
    neighborhood?: SortOrder
    numberHouse?: SortOrder
    reference?: SortOrder
    city?: SortOrder
  }

  export type AddressSumOrderByAggregateInput = {
    id?: SortOrder
    numberHouse?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type ClientOrderByRelevanceInput = {
    fields: ClientOrderByRelevanceFieldEnum | ClientOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
  }

  export type ClientAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
  }

  export type ClientSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RegisterScalarRelationFilter = {
    is?: RegisterWhereInput
    isNot?: RegisterWhereInput
  }

  export type OrderdeliveryOrderByRelevanceInput = {
    fields: OrderdeliveryOrderByRelevanceFieldEnum | OrderdeliveryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type OrderdeliveryCountOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
    quantity?: SortOrder
    amount?: SortOrder
    data?: SortOrder
  }

  export type OrderdeliveryAvgOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
    amount?: SortOrder
  }

  export type OrderdeliveryMaxOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
    quantity?: SortOrder
    amount?: SortOrder
    data?: SortOrder
  }

  export type OrderdeliveryMinOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
    quantity?: SortOrder
    amount?: SortOrder
    data?: SortOrder
  }

  export type OrderdeliverySumOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
    amount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OrderdeliveryNullableScalarRelationFilter = {
    is?: OrderdeliveryWhereInput | null
    isNot?: OrderdeliveryWhereInput | null
  }

  export type AddressScalarRelationFilter = {
    is?: AddressWhereInput
    isNot?: AddressWhereInput
  }

  export type ClientScalarRelationFilter = {
    is?: ClientWhereInput
    isNot?: ClientWhereInput
  }

  export type RegisterCountOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    addressId?: SortOrder
  }

  export type RegisterAvgOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    addressId?: SortOrder
  }

  export type RegisterMaxOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    addressId?: SortOrder
  }

  export type RegisterMinOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    addressId?: SortOrder
  }

  export type RegisterSumOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    addressId?: SortOrder
  }

  export type RegisterCreateNestedManyWithoutAddressInput = {
    create?: XOR<RegisterCreateWithoutAddressInput, RegisterUncheckedCreateWithoutAddressInput> | RegisterCreateWithoutAddressInput[] | RegisterUncheckedCreateWithoutAddressInput[]
    connectOrCreate?: RegisterCreateOrConnectWithoutAddressInput | RegisterCreateOrConnectWithoutAddressInput[]
    createMany?: RegisterCreateManyAddressInputEnvelope
    connect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
  }

  export type RegisterUncheckedCreateNestedManyWithoutAddressInput = {
    create?: XOR<RegisterCreateWithoutAddressInput, RegisterUncheckedCreateWithoutAddressInput> | RegisterCreateWithoutAddressInput[] | RegisterUncheckedCreateWithoutAddressInput[]
    connectOrCreate?: RegisterCreateOrConnectWithoutAddressInput | RegisterCreateOrConnectWithoutAddressInput[]
    createMany?: RegisterCreateManyAddressInputEnvelope
    connect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RegisterUpdateManyWithoutAddressNestedInput = {
    create?: XOR<RegisterCreateWithoutAddressInput, RegisterUncheckedCreateWithoutAddressInput> | RegisterCreateWithoutAddressInput[] | RegisterUncheckedCreateWithoutAddressInput[]
    connectOrCreate?: RegisterCreateOrConnectWithoutAddressInput | RegisterCreateOrConnectWithoutAddressInput[]
    upsert?: RegisterUpsertWithWhereUniqueWithoutAddressInput | RegisterUpsertWithWhereUniqueWithoutAddressInput[]
    createMany?: RegisterCreateManyAddressInputEnvelope
    set?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    disconnect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    delete?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    connect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    update?: RegisterUpdateWithWhereUniqueWithoutAddressInput | RegisterUpdateWithWhereUniqueWithoutAddressInput[]
    updateMany?: RegisterUpdateManyWithWhereWithoutAddressInput | RegisterUpdateManyWithWhereWithoutAddressInput[]
    deleteMany?: RegisterScalarWhereInput | RegisterScalarWhereInput[]
  }

  export type RegisterUncheckedUpdateManyWithoutAddressNestedInput = {
    create?: XOR<RegisterCreateWithoutAddressInput, RegisterUncheckedCreateWithoutAddressInput> | RegisterCreateWithoutAddressInput[] | RegisterUncheckedCreateWithoutAddressInput[]
    connectOrCreate?: RegisterCreateOrConnectWithoutAddressInput | RegisterCreateOrConnectWithoutAddressInput[]
    upsert?: RegisterUpsertWithWhereUniqueWithoutAddressInput | RegisterUpsertWithWhereUniqueWithoutAddressInput[]
    createMany?: RegisterCreateManyAddressInputEnvelope
    set?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    disconnect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    delete?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    connect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    update?: RegisterUpdateWithWhereUniqueWithoutAddressInput | RegisterUpdateWithWhereUniqueWithoutAddressInput[]
    updateMany?: RegisterUpdateManyWithWhereWithoutAddressInput | RegisterUpdateManyWithWhereWithoutAddressInput[]
    deleteMany?: RegisterScalarWhereInput | RegisterScalarWhereInput[]
  }

  export type RegisterCreateNestedManyWithoutClientInput = {
    create?: XOR<RegisterCreateWithoutClientInput, RegisterUncheckedCreateWithoutClientInput> | RegisterCreateWithoutClientInput[] | RegisterUncheckedCreateWithoutClientInput[]
    connectOrCreate?: RegisterCreateOrConnectWithoutClientInput | RegisterCreateOrConnectWithoutClientInput[]
    createMany?: RegisterCreateManyClientInputEnvelope
    connect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
  }

  export type RegisterUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<RegisterCreateWithoutClientInput, RegisterUncheckedCreateWithoutClientInput> | RegisterCreateWithoutClientInput[] | RegisterUncheckedCreateWithoutClientInput[]
    connectOrCreate?: RegisterCreateOrConnectWithoutClientInput | RegisterCreateOrConnectWithoutClientInput[]
    createMany?: RegisterCreateManyClientInputEnvelope
    connect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
  }

  export type RegisterUpdateManyWithoutClientNestedInput = {
    create?: XOR<RegisterCreateWithoutClientInput, RegisterUncheckedCreateWithoutClientInput> | RegisterCreateWithoutClientInput[] | RegisterUncheckedCreateWithoutClientInput[]
    connectOrCreate?: RegisterCreateOrConnectWithoutClientInput | RegisterCreateOrConnectWithoutClientInput[]
    upsert?: RegisterUpsertWithWhereUniqueWithoutClientInput | RegisterUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: RegisterCreateManyClientInputEnvelope
    set?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    disconnect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    delete?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    connect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    update?: RegisterUpdateWithWhereUniqueWithoutClientInput | RegisterUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: RegisterUpdateManyWithWhereWithoutClientInput | RegisterUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: RegisterScalarWhereInput | RegisterScalarWhereInput[]
  }

  export type RegisterUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<RegisterCreateWithoutClientInput, RegisterUncheckedCreateWithoutClientInput> | RegisterCreateWithoutClientInput[] | RegisterUncheckedCreateWithoutClientInput[]
    connectOrCreate?: RegisterCreateOrConnectWithoutClientInput | RegisterCreateOrConnectWithoutClientInput[]
    upsert?: RegisterUpsertWithWhereUniqueWithoutClientInput | RegisterUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: RegisterCreateManyClientInputEnvelope
    set?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    disconnect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    delete?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    connect?: RegisterWhereUniqueInput | RegisterWhereUniqueInput[]
    update?: RegisterUpdateWithWhereUniqueWithoutClientInput | RegisterUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: RegisterUpdateManyWithWhereWithoutClientInput | RegisterUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: RegisterScalarWhereInput | RegisterScalarWhereInput[]
  }

  export type RegisterCreateNestedOneWithoutOrderdeliveryInput = {
    create?: XOR<RegisterCreateWithoutOrderdeliveryInput, RegisterUncheckedCreateWithoutOrderdeliveryInput>
    connectOrCreate?: RegisterCreateOrConnectWithoutOrderdeliveryInput
    connect?: RegisterWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RegisterUpdateOneRequiredWithoutOrderdeliveryNestedInput = {
    create?: XOR<RegisterCreateWithoutOrderdeliveryInput, RegisterUncheckedCreateWithoutOrderdeliveryInput>
    connectOrCreate?: RegisterCreateOrConnectWithoutOrderdeliveryInput
    upsert?: RegisterUpsertWithoutOrderdeliveryInput
    connect?: RegisterWhereUniqueInput
    update?: XOR<XOR<RegisterUpdateToOneWithWhereWithoutOrderdeliveryInput, RegisterUpdateWithoutOrderdeliveryInput>, RegisterUncheckedUpdateWithoutOrderdeliveryInput>
  }

  export type OrderdeliveryCreateNestedOneWithoutRegisterInput = {
    create?: XOR<OrderdeliveryCreateWithoutRegisterInput, OrderdeliveryUncheckedCreateWithoutRegisterInput>
    connectOrCreate?: OrderdeliveryCreateOrConnectWithoutRegisterInput
    connect?: OrderdeliveryWhereUniqueInput
  }

  export type AddressCreateNestedOneWithoutRegisterInput = {
    create?: XOR<AddressCreateWithoutRegisterInput, AddressUncheckedCreateWithoutRegisterInput>
    connectOrCreate?: AddressCreateOrConnectWithoutRegisterInput
    connect?: AddressWhereUniqueInput
  }

  export type ClientCreateNestedOneWithoutRegisterInput = {
    create?: XOR<ClientCreateWithoutRegisterInput, ClientUncheckedCreateWithoutRegisterInput>
    connectOrCreate?: ClientCreateOrConnectWithoutRegisterInput
    connect?: ClientWhereUniqueInput
  }

  export type OrderdeliveryUncheckedCreateNestedOneWithoutRegisterInput = {
    create?: XOR<OrderdeliveryCreateWithoutRegisterInput, OrderdeliveryUncheckedCreateWithoutRegisterInput>
    connectOrCreate?: OrderdeliveryCreateOrConnectWithoutRegisterInput
    connect?: OrderdeliveryWhereUniqueInput
  }

  export type OrderdeliveryUpdateOneWithoutRegisterNestedInput = {
    create?: XOR<OrderdeliveryCreateWithoutRegisterInput, OrderdeliveryUncheckedCreateWithoutRegisterInput>
    connectOrCreate?: OrderdeliveryCreateOrConnectWithoutRegisterInput
    upsert?: OrderdeliveryUpsertWithoutRegisterInput
    disconnect?: OrderdeliveryWhereInput | boolean
    delete?: OrderdeliveryWhereInput | boolean
    connect?: OrderdeliveryWhereUniqueInput
    update?: XOR<XOR<OrderdeliveryUpdateToOneWithWhereWithoutRegisterInput, OrderdeliveryUpdateWithoutRegisterInput>, OrderdeliveryUncheckedUpdateWithoutRegisterInput>
  }

  export type AddressUpdateOneRequiredWithoutRegisterNestedInput = {
    create?: XOR<AddressCreateWithoutRegisterInput, AddressUncheckedCreateWithoutRegisterInput>
    connectOrCreate?: AddressCreateOrConnectWithoutRegisterInput
    upsert?: AddressUpsertWithoutRegisterInput
    connect?: AddressWhereUniqueInput
    update?: XOR<XOR<AddressUpdateToOneWithWhereWithoutRegisterInput, AddressUpdateWithoutRegisterInput>, AddressUncheckedUpdateWithoutRegisterInput>
  }

  export type ClientUpdateOneRequiredWithoutRegisterNestedInput = {
    create?: XOR<ClientCreateWithoutRegisterInput, ClientUncheckedCreateWithoutRegisterInput>
    connectOrCreate?: ClientCreateOrConnectWithoutRegisterInput
    upsert?: ClientUpsertWithoutRegisterInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutRegisterInput, ClientUpdateWithoutRegisterInput>, ClientUncheckedUpdateWithoutRegisterInput>
  }

  export type OrderdeliveryUncheckedUpdateOneWithoutRegisterNestedInput = {
    create?: XOR<OrderdeliveryCreateWithoutRegisterInput, OrderdeliveryUncheckedCreateWithoutRegisterInput>
    connectOrCreate?: OrderdeliveryCreateOrConnectWithoutRegisterInput
    upsert?: OrderdeliveryUpsertWithoutRegisterInput
    disconnect?: OrderdeliveryWhereInput | boolean
    delete?: OrderdeliveryWhereInput | boolean
    connect?: OrderdeliveryWhereUniqueInput
    update?: XOR<XOR<OrderdeliveryUpdateToOneWithWhereWithoutRegisterInput, OrderdeliveryUpdateWithoutRegisterInput>, OrderdeliveryUncheckedUpdateWithoutRegisterInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type RegisterCreateWithoutAddressInput = {
    orderdelivery?: OrderdeliveryCreateNestedOneWithoutRegisterInput
    client: ClientCreateNestedOneWithoutRegisterInput
  }

  export type RegisterUncheckedCreateWithoutAddressInput = {
    id?: number
    clientId: number
    orderdelivery?: OrderdeliveryUncheckedCreateNestedOneWithoutRegisterInput
  }

  export type RegisterCreateOrConnectWithoutAddressInput = {
    where: RegisterWhereUniqueInput
    create: XOR<RegisterCreateWithoutAddressInput, RegisterUncheckedCreateWithoutAddressInput>
  }

  export type RegisterCreateManyAddressInputEnvelope = {
    data: RegisterCreateManyAddressInput | RegisterCreateManyAddressInput[]
    skipDuplicates?: boolean
  }

  export type RegisterUpsertWithWhereUniqueWithoutAddressInput = {
    where: RegisterWhereUniqueInput
    update: XOR<RegisterUpdateWithoutAddressInput, RegisterUncheckedUpdateWithoutAddressInput>
    create: XOR<RegisterCreateWithoutAddressInput, RegisterUncheckedCreateWithoutAddressInput>
  }

  export type RegisterUpdateWithWhereUniqueWithoutAddressInput = {
    where: RegisterWhereUniqueInput
    data: XOR<RegisterUpdateWithoutAddressInput, RegisterUncheckedUpdateWithoutAddressInput>
  }

  export type RegisterUpdateManyWithWhereWithoutAddressInput = {
    where: RegisterScalarWhereInput
    data: XOR<RegisterUpdateManyMutationInput, RegisterUncheckedUpdateManyWithoutAddressInput>
  }

  export type RegisterScalarWhereInput = {
    AND?: RegisterScalarWhereInput | RegisterScalarWhereInput[]
    OR?: RegisterScalarWhereInput[]
    NOT?: RegisterScalarWhereInput | RegisterScalarWhereInput[]
    id?: IntFilter<"Register"> | number
    clientId?: IntFilter<"Register"> | number
    addressId?: IntFilter<"Register"> | number
  }

  export type RegisterCreateWithoutClientInput = {
    orderdelivery?: OrderdeliveryCreateNestedOneWithoutRegisterInput
    address: AddressCreateNestedOneWithoutRegisterInput
  }

  export type RegisterUncheckedCreateWithoutClientInput = {
    id?: number
    addressId: number
    orderdelivery?: OrderdeliveryUncheckedCreateNestedOneWithoutRegisterInput
  }

  export type RegisterCreateOrConnectWithoutClientInput = {
    where: RegisterWhereUniqueInput
    create: XOR<RegisterCreateWithoutClientInput, RegisterUncheckedCreateWithoutClientInput>
  }

  export type RegisterCreateManyClientInputEnvelope = {
    data: RegisterCreateManyClientInput | RegisterCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type RegisterUpsertWithWhereUniqueWithoutClientInput = {
    where: RegisterWhereUniqueInput
    update: XOR<RegisterUpdateWithoutClientInput, RegisterUncheckedUpdateWithoutClientInput>
    create: XOR<RegisterCreateWithoutClientInput, RegisterUncheckedCreateWithoutClientInput>
  }

  export type RegisterUpdateWithWhereUniqueWithoutClientInput = {
    where: RegisterWhereUniqueInput
    data: XOR<RegisterUpdateWithoutClientInput, RegisterUncheckedUpdateWithoutClientInput>
  }

  export type RegisterUpdateManyWithWhereWithoutClientInput = {
    where: RegisterScalarWhereInput
    data: XOR<RegisterUpdateManyMutationInput, RegisterUncheckedUpdateManyWithoutClientInput>
  }

  export type RegisterCreateWithoutOrderdeliveryInput = {
    address: AddressCreateNestedOneWithoutRegisterInput
    client: ClientCreateNestedOneWithoutRegisterInput
  }

  export type RegisterUncheckedCreateWithoutOrderdeliveryInput = {
    id?: number
    clientId: number
    addressId: number
  }

  export type RegisterCreateOrConnectWithoutOrderdeliveryInput = {
    where: RegisterWhereUniqueInput
    create: XOR<RegisterCreateWithoutOrderdeliveryInput, RegisterUncheckedCreateWithoutOrderdeliveryInput>
  }

  export type RegisterUpsertWithoutOrderdeliveryInput = {
    update: XOR<RegisterUpdateWithoutOrderdeliveryInput, RegisterUncheckedUpdateWithoutOrderdeliveryInput>
    create: XOR<RegisterCreateWithoutOrderdeliveryInput, RegisterUncheckedCreateWithoutOrderdeliveryInput>
    where?: RegisterWhereInput
  }

  export type RegisterUpdateToOneWithWhereWithoutOrderdeliveryInput = {
    where?: RegisterWhereInput
    data: XOR<RegisterUpdateWithoutOrderdeliveryInput, RegisterUncheckedUpdateWithoutOrderdeliveryInput>
  }

  export type RegisterUpdateWithoutOrderdeliveryInput = {
    address?: AddressUpdateOneRequiredWithoutRegisterNestedInput
    client?: ClientUpdateOneRequiredWithoutRegisterNestedInput
  }

  export type RegisterUncheckedUpdateWithoutOrderdeliveryInput = {
    id?: IntFieldUpdateOperationsInput | number
    clientId?: IntFieldUpdateOperationsInput | number
    addressId?: IntFieldUpdateOperationsInput | number
  }

  export type OrderdeliveryCreateWithoutRegisterInput = {
    quantity: string
    amount: number
    data: Date | string
  }

  export type OrderdeliveryUncheckedCreateWithoutRegisterInput = {
    id?: number
    quantity: string
    amount: number
    data: Date | string
  }

  export type OrderdeliveryCreateOrConnectWithoutRegisterInput = {
    where: OrderdeliveryWhereUniqueInput
    create: XOR<OrderdeliveryCreateWithoutRegisterInput, OrderdeliveryUncheckedCreateWithoutRegisterInput>
  }

  export type AddressCreateWithoutRegisterInput = {
    street: string
    neighborhood: string
    numberHouse: number
    reference: string
    city: string
  }

  export type AddressUncheckedCreateWithoutRegisterInput = {
    id?: number
    street: string
    neighborhood: string
    numberHouse: number
    reference: string
    city: string
  }

  export type AddressCreateOrConnectWithoutRegisterInput = {
    where: AddressWhereUniqueInput
    create: XOR<AddressCreateWithoutRegisterInput, AddressUncheckedCreateWithoutRegisterInput>
  }

  export type ClientCreateWithoutRegisterInput = {
    name: string
    lastName: string
    phone: string
  }

  export type ClientUncheckedCreateWithoutRegisterInput = {
    id?: number
    name: string
    lastName: string
    phone: string
  }

  export type ClientCreateOrConnectWithoutRegisterInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutRegisterInput, ClientUncheckedCreateWithoutRegisterInput>
  }

  export type OrderdeliveryUpsertWithoutRegisterInput = {
    update: XOR<OrderdeliveryUpdateWithoutRegisterInput, OrderdeliveryUncheckedUpdateWithoutRegisterInput>
    create: XOR<OrderdeliveryCreateWithoutRegisterInput, OrderdeliveryUncheckedCreateWithoutRegisterInput>
    where?: OrderdeliveryWhereInput
  }

  export type OrderdeliveryUpdateToOneWithWhereWithoutRegisterInput = {
    where?: OrderdeliveryWhereInput
    data: XOR<OrderdeliveryUpdateWithoutRegisterInput, OrderdeliveryUncheckedUpdateWithoutRegisterInput>
  }

  export type OrderdeliveryUpdateWithoutRegisterInput = {
    quantity?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderdeliveryUncheckedUpdateWithoutRegisterInput = {
    id?: IntFieldUpdateOperationsInput | number
    quantity?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUpsertWithoutRegisterInput = {
    update: XOR<AddressUpdateWithoutRegisterInput, AddressUncheckedUpdateWithoutRegisterInput>
    create: XOR<AddressCreateWithoutRegisterInput, AddressUncheckedCreateWithoutRegisterInput>
    where?: AddressWhereInput
  }

  export type AddressUpdateToOneWithWhereWithoutRegisterInput = {
    where?: AddressWhereInput
    data: XOR<AddressUpdateWithoutRegisterInput, AddressUncheckedUpdateWithoutRegisterInput>
  }

  export type AddressUpdateWithoutRegisterInput = {
    street?: StringFieldUpdateOperationsInput | string
    neighborhood?: StringFieldUpdateOperationsInput | string
    numberHouse?: IntFieldUpdateOperationsInput | number
    reference?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
  }

  export type AddressUncheckedUpdateWithoutRegisterInput = {
    id?: IntFieldUpdateOperationsInput | number
    street?: StringFieldUpdateOperationsInput | string
    neighborhood?: StringFieldUpdateOperationsInput | string
    numberHouse?: IntFieldUpdateOperationsInput | number
    reference?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
  }

  export type ClientUpsertWithoutRegisterInput = {
    update: XOR<ClientUpdateWithoutRegisterInput, ClientUncheckedUpdateWithoutRegisterInput>
    create: XOR<ClientCreateWithoutRegisterInput, ClientUncheckedCreateWithoutRegisterInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutRegisterInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutRegisterInput, ClientUncheckedUpdateWithoutRegisterInput>
  }

  export type ClientUpdateWithoutRegisterInput = {
    name?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type ClientUncheckedUpdateWithoutRegisterInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type RegisterCreateManyAddressInput = {
    id?: number
    clientId: number
  }

  export type RegisterUpdateWithoutAddressInput = {
    orderdelivery?: OrderdeliveryUpdateOneWithoutRegisterNestedInput
    client?: ClientUpdateOneRequiredWithoutRegisterNestedInput
  }

  export type RegisterUncheckedUpdateWithoutAddressInput = {
    id?: IntFieldUpdateOperationsInput | number
    clientId?: IntFieldUpdateOperationsInput | number
    orderdelivery?: OrderdeliveryUncheckedUpdateOneWithoutRegisterNestedInput
  }

  export type RegisterUncheckedUpdateManyWithoutAddressInput = {
    id?: IntFieldUpdateOperationsInput | number
    clientId?: IntFieldUpdateOperationsInput | number
  }

  export type RegisterCreateManyClientInput = {
    id?: number
    addressId: number
  }

  export type RegisterUpdateWithoutClientInput = {
    orderdelivery?: OrderdeliveryUpdateOneWithoutRegisterNestedInput
    address?: AddressUpdateOneRequiredWithoutRegisterNestedInput
  }

  export type RegisterUncheckedUpdateWithoutClientInput = {
    id?: IntFieldUpdateOperationsInput | number
    addressId?: IntFieldUpdateOperationsInput | number
    orderdelivery?: OrderdeliveryUncheckedUpdateOneWithoutRegisterNestedInput
  }

  export type RegisterUncheckedUpdateManyWithoutClientInput = {
    id?: IntFieldUpdateOperationsInput | number
    addressId?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}