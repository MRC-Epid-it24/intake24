import { UserEntry } from '@common/types/http';
import { User } from '@/db/models/system';

export default (user: User): UserEntry => user.get();
