
//todo
/// import { TestBed } from '@angular/core/testing';
// import { PdeElectronBridgeV1, UiMode, Environment } from '@common/types';

// import { ElectronService } from './electron.service';
// import { WindowRefService } from './window-ref.service';

// describe('ElectronService', () => {
//   let svc: ElectronService;
//   let windowRefService: jasmine.SpyObj<WindowRefService>;
//   let pdeElectronBridgeV1: jasmine.SpyObj<PdeElectronBridgeV1>;

//   beforeEach(() => {
//     windowRefService = new WindowRefService();
//     pdeElectronBridgeV1 = jasmine.createSpyObj('pdeElectronBridgeV1', ['getEnvironment']);
//     spyOnProperty(windowRefService, 'nativeWindow', 'get').and.returnValue({
//       pdeElectronBridgeV1: pdeElectronBridgeV1,
//     });

//     TestBed.configureTestingModule({
//       providers: [ElectronService, { provide: WindowRefService, useValue: windowRefService }],
//     });

//     svc = TestBed.get(ElectronService);
//   });

//   it('should be created', () => {
//     expect(svc).toBeTruthy();
//   });

//   it('should return embedded state', async () => {
//     pdeElectronBridgeV1.getEnvironment = pdeElectronBridgeV1.getEnvironment.and.returnValue(
//       Promise.resolve({
//         uiMode: UiMode.Embedded,
//       } as Environment),
//     );

//     const isEmbedded = await svc.isEmbedded();
//     expect(pdeElectronBridgeV1.getEnvironment).toHaveBeenCalledWith();
//     expect(isEmbedded).toBe(true);
//   });
// });
