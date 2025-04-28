import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

import { GestionUsuariosComponent } from './pages/authentication/gestion-usuarios/gestion-usuarios.component';
import { GestionPermisosComponent } from './pages/authentication/gestion-permisos/gestion-permisos.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GestionRolesComponent } from './pages/authentication/gestion-roles/gestion-roles.component';

import { ReporteComponent } from './pages/reporte/reporte.component';

import { AuthGuard } from './guards/auth.guard';
//@ts-ignore
import { ContratoComponent } from './pages/contrato/contrato.component';
//@ts-ignore
import { CrearContratoComponent } from './pages/contrato/crear-contrato/crear-contrato.component';
//@ts-ignore
import { LeerContratoComponent } from './pages/contrato/leer-contrato/leer-contrato.component';
//@ts-ignore
import { ActualizarContratoComponent } from './pages/contrato/actualizar-contrato/actualizar-contrato.component';
//@ts-ignore
import { EliminarContratoComponent } from './pages/contrato/eliminar-contrato/eliminar-contrato.component';
//@ts-ignore
import { CuentaCobroComponent } from './pages/cuentacobro/cuentacobro.component';
//@ts-ignore
import { CrearCuentaCobroComponent } from './pages/cuentacobro/crear-cuentacobro/crear-cuentacobro.component';
//@ts-ignore
import { LeerCuentaCobroComponent } from './pages/cuentacobro/leer-cuentacobro/leer-cuentacobro.component';
//@ts-ignore
import { ActualizarCuentaCobroComponent } from './pages/cuentacobro/actualizar-cuentacobro/actualizar-cuentacobro.component';
//@ts-ignore
import { EliminarCuentaCobroComponent } from './pages/cuentacobro/eliminar-cuentacobro/eliminar-cuentacobro.component';
//@ts-ignore
import { DocumentoComponent } from './pages/documento/documento.component';
//@ts-ignore
import { CrearDocumentoComponent } from './pages/documento/crear-documento/crear-documento.component';
//@ts-ignore
import { LeerDocumentoComponent } from './pages/documento/leer-documento/leer-documento.component';
//@ts-ignore
import { ActualizarDocumentoComponent } from './pages/documento/actualizar-documento/actualizar-documento.component';
//@ts-ignore
import { EliminarDocumentoComponent } from './pages/documento/eliminar-documento/eliminar-documento.component';
//@ts-ignore
import { InformeComponent } from './pages/informe/informe.component';
//@ts-ignore
import { CrearInformeComponent } from './pages/informe/crear-informe/crear-informe.component';
//@ts-ignore
import { LeerInformeComponent } from './pages/informe/leer-informe/leer-informe.component';
//@ts-ignore
import { ActualizarInformeComponent } from './pages/informe/actualizar-informe/actualizar-informe.component';
//@ts-ignore
import { EliminarInformeComponent } from './pages/informe/eliminar-informe/eliminar-informe.component';
//@ts-ignore
import { PeriodicidadPagoComponent } from './pages/periodicidadpago/periodicidadpago.component';
//@ts-ignore
import { CrearPeriodicidadPagoComponent } from './pages/periodicidadpago/crear-periodicidadpago/crear-periodicidadpago.component';
//@ts-ignore
import { LeerPeriodicidadPagoComponent } from './pages/periodicidadpago/leer-periodicidadpago/leer-periodicidadpago.component';
//@ts-ignore
import { ActualizarPeriodicidadPagoComponent } from './pages/periodicidadpago/actualizar-periodicidadpago/actualizar-periodicidadpago.component';
//@ts-ignore
import { EliminarPeriodicidadPagoComponent } from './pages/periodicidadpago/eliminar-periodicidadpago/eliminar-periodicidadpago.component';
//@ts-ignore
import { PersonaComponent } from './pages/persona/persona.component';
//@ts-ignore
import { CrearPersonaComponent } from './pages/persona/crear-persona/crear-persona.component';
//@ts-ignore
import { LeerPersonaComponent } from './pages/persona/leer-persona/leer-persona.component';
//@ts-ignore
import { ActualizarPersonaComponent } from './pages/persona/actualizar-persona/actualizar-persona.component';
//@ts-ignore
import { EliminarPersonaComponent } from './pages/persona/eliminar-persona/eliminar-persona.component';
//@ts-ignore
import { ProyectoComponent } from './pages/proyecto/proyecto.component';
//@ts-ignore
import { CrearProyectoComponent } from './pages/proyecto/crear-proyecto/crear-proyecto.component';
//@ts-ignore
import { LeerProyectoComponent } from './pages/proyecto/leer-proyecto/leer-proyecto.component';
//@ts-ignore
import { ActualizarProyectoComponent } from './pages/proyecto/actualizar-proyecto/actualizar-proyecto.component';
//@ts-ignore
import { EliminarProyectoComponent } from './pages/proyecto/eliminar-proyecto/eliminar-proyecto.component';
//@ts-ignore
import { TipoContratoComponent } from './pages/tipocontrato/tipocontrato.component';
//@ts-ignore
import { CrearTipoContratoComponent } from './pages/tipocontrato/crear-tipocontrato/crear-tipocontrato.component';
//@ts-ignore
import { LeerTipoContratoComponent } from './pages/tipocontrato/leer-tipocontrato/leer-tipocontrato.component';
//@ts-ignore
import { ActualizarTipoContratoComponent } from './pages/tipocontrato/actualizar-tipocontrato/actualizar-tipocontrato.component';
//@ts-ignore
import { EliminarTipoContratoComponent } from './pages/tipocontrato/eliminar-tipocontrato/eliminar-tipocontrato.component';
//@ts-ignore
import { TipoDocumentoComponent } from './pages/tipodocumento/tipodocumento.component';
//@ts-ignore
import { CrearTipoDocumentoComponent } from './pages/tipodocumento/crear-tipodocumento/crear-tipodocumento.component';
//@ts-ignore
import { LeerTipoDocumentoComponent } from './pages/tipodocumento/leer-tipodocumento/leer-tipodocumento.component';
//@ts-ignore
import { ActualizarTipoDocumentoComponent } from './pages/tipodocumento/actualizar-tipodocumento/actualizar-tipodocumento.component';
//@ts-ignore
import { EliminarTipoDocumentoComponent } from './pages/tipodocumento/eliminar-tipodocumento/eliminar-tipodocumento.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'inicio',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
        canActivate: [AuthGuard]
      },
      {
        path: 'contrato',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ContratoComponent },
          { path: 'crear', component: CrearContratoComponent },
          { path: 'leer', component: LeerContratoComponent },
          { path: 'actualizar', component: ActualizarContratoComponent },
          { path: 'eliminar', component: EliminarContratoComponent },
        ]
      },
      {
        path: 'cuentacobro',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: CuentaCobroComponent },
          { path: 'crear', component: CrearCuentaCobroComponent },
          { path: 'leer', component: LeerCuentaCobroComponent },
          { path: 'actualizar', component: ActualizarCuentaCobroComponent },
          { path: 'eliminar', component: EliminarCuentaCobroComponent },
        ]
      },
      {
        path: 'documento',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: DocumentoComponent },
          { path: 'crear', component: CrearDocumentoComponent },
          { path: 'leer', component: LeerDocumentoComponent },
          { path: 'actualizar', component: ActualizarDocumentoComponent },
          { path: 'eliminar', component: EliminarDocumentoComponent },
        ]
      },
      {
        path: 'informe',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: InformeComponent },
          { path: 'crear', component: CrearInformeComponent },
          { path: 'leer', component: LeerInformeComponent },
          { path: 'actualizar', component: ActualizarInformeComponent },
          { path: 'eliminar', component: EliminarInformeComponent },
        ]
      },
      {
        path: 'periodicidadpago',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: PeriodicidadPagoComponent },
          { path: 'crear', component: CrearPeriodicidadPagoComponent },
          { path: 'leer', component: LeerPeriodicidadPagoComponent },
          { path: 'actualizar', component: ActualizarPeriodicidadPagoComponent },
          { path: 'eliminar', component: EliminarPeriodicidadPagoComponent },
        ]
      },
      {
        path: 'persona',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: PersonaComponent },
          { path: 'crear', component: CrearPersonaComponent },
          { path: 'leer', component: LeerPersonaComponent },
          { path: 'actualizar', component: ActualizarPersonaComponent },
          { path: 'eliminar', component: EliminarPersonaComponent },
        ]
      },
      {
        path: 'proyecto',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ProyectoComponent },
          { path: 'crear', component: CrearProyectoComponent },
          { path: 'leer', component: LeerProyectoComponent },
          { path: 'actualizar', component: ActualizarProyectoComponent },
          { path: 'eliminar', component: EliminarProyectoComponent },
        ]
      },
      {
        path: 'tipocontrato',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: TipoContratoComponent },
          { path: 'crear', component: CrearTipoContratoComponent },
          { path: 'leer', component: LeerTipoContratoComponent },
          { path: 'actualizar', component: ActualizarTipoContratoComponent },
          { path: 'eliminar', component: EliminarTipoContratoComponent },
        ]
      },
      {
        path: 'tipodocumento',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: TipoDocumentoComponent },
          { path: 'crear', component: CrearTipoDocumentoComponent },
          { path: 'leer', component: LeerTipoDocumentoComponent },
          { path: 'actualizar', component: ActualizarTipoDocumentoComponent },
          { path: 'eliminar', component: EliminarTipoDocumentoComponent },
        ]
      },
      { path: 'permisos', component: GestionPermisosComponent, canActivate: [AuthGuard] },
      { path: 'usuarios', component: GestionUsuariosComponent, canActivate: [AuthGuard] },
      { path: 'roles', component: GestionRolesComponent, canActivate: [AuthGuard] },
      { path: 'reportes', component: ReporteComponent, canActivate: [AuthGuard] },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  },
];