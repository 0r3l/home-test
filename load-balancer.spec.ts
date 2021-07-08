import { LoadBalancer } from './load-balancer';
test('should create load balancer', () => {
  const lb = new LoadBalancer();
  expect(lb).toBeDefined();
});

test('should forward to S1 server', () => {
  const lb = new LoadBalancer();
  const server = lb.forward('client-1');
  expect(server).toBe('S1');
});

test('should return S2 and update server sizes correctly', () => {
  const lb = new LoadBalancer();
  lb.forward('client-1');
  lb.forward('client-2');
  lb.forward('client-3');
  lb.forward('client-4');
  const server = lb.forward('client-5');
  expect(lb.serversSizes).toEqual([2,2,1]);
  expect(server).toBe('S2')
});


test('should ignore server when availability changed', () => {
  const lb = new LoadBalancer();
  lb.forward('client-1');
  lb.forward('client-2');
  lb.forward('client-3');
  lb.onServerDown('S2')
  lb.forward('client-4');
  lb.forward('client-5');
  expect(lb.serversSizes).toEqual([2,1,1]);
});
