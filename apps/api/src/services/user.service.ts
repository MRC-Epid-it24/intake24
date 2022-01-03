import { UserPhysicalData } from '@api/db';
import type { UserPhysicalDataAttributes } from '@common/types/models';

export type UpdatePasswordInput = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const userService = () => {
  /**
   * Get user physical data
   *
   * @param {string} userId
   */
  const getPhysicalData = async (userId: string) => UserPhysicalData.findByPk(userId);

  /**
   * Update user physical data
   *
   * @param {string} userId
   * @param {Omit<UserPhysicalDataAttributes, 'userId'>} input
   * @returns {Promise<UserPhysicalData>}
   */
  const setPhysicalData = async (
    userId: string,
    input: Omit<UserPhysicalDataAttributes, 'userId'>
  ): Promise<UserPhysicalData> => {
    const [data] = await UserPhysicalData.upsert({ ...input, userId });

    return data;
  };

  return {
    getPhysicalData,
    setPhysicalData,
  };
};

export default userService;

export type UserService = ReturnType<typeof userService>;
