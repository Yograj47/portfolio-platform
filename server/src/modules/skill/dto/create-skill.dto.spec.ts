import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSkillDto } from './create-skill.dto';

describe('Skill validation', () => {
  it.each([-1, 101, 1.5])('rejects invalid level %s', async (level) => {
    expect(
      (
        await validate(
          plainToInstance(CreateSkillDto, { name: 'React', level }),
        )
      ).length,
    ).toBeGreaterThan(0);
  });
  it('accepts omitted optional icon, color and ordering', async () => {
    expect(
      await validate(
        plainToInstance(CreateSkillDto, { name: 'React', level: 80 }),
      ),
    ).toHaveLength(0);
  });
});
