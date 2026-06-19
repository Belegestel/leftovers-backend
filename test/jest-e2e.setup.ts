import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config({
  path: 'test.env'
})

execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: process.env
});
