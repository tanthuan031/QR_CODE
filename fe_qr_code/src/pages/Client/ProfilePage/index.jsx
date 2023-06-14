// @flow
import * as React from 'react';
import { ClientProfile } from '../../../components/Client/Profile';

export function ClientProfilePage() {
  return (
    <>
      <section>
        <div className="container-fluid mt-5">
          <div className="row">
            <h5 className="font-weight-bold mb-3">Hồ sơ người dùng</h5>
            <ClientProfile />
          </div>
        </div>
      </section>
    </>
  );
}
