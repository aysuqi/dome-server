import { RemoveSensitiveInfoInterceptor } from '../remove-sensitive-info.interceptor';

describe('remove-sensitive-info.interceptor', () => {
  it('delValue should run', () => {
    const re = new RemoveSensitiveInfoInterceptor();
    expect(re.delValue({ b: 1, a: 2 }, 'a')).toEqual({ b: 1 });
  });
});
