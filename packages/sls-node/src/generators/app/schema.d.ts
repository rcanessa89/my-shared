import type { Linter, LinterType } from '@nx/eslint';

export interface AppGeneratorSchema {
  directory: string;
  name?: string;
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  linter?: Linter | LinterType;
  unitTestRunner?: 'jest' | 'none';
  e2eTestRunner?: 'jest' | 'none';
  tags?: string;
  swcJest?: boolean;
  js?: boolean;
  port?: number;
}
