  <div className="row header_detail_classroom">
        <div className="col col-md-4 p-2">
          <div className="row">
            <p className=" col col-md-2 text-center">STT</p>
            <p className="col col-md-4 text-center">MSSV</p>
            <p className="col col-md-6 text-center">Tên sinh viên</p>
          </div>
        </div>
        <div className="col col-md-7 p-2 ">
          <div className="d-flex align-items-center justify-content-center">
            <p className=" text-center">Tuần</p>
          </div>
        </div>
        <div className="col col-md-1 p-2">
          <div className="row">
            <p className="col col-md-6 text-center">Điểm</p>
            <p className="col col-md-6 text-center">Action</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col col-md-4" style={{ marginTop: '2px' }}>
          <div className="row">
            <p className=" col col-md-2 text-center">-</p>
            <p className="col col-md-4 text-center">-</p>
            <p className="col col-md-6 text-center">-</p>
          </div>
          {dataDetail.data !== undefined && dataDetail.data !== null && Object.values(dataDetail.data).length !== 0 && (
            <div className="row">
              <p className="col col-md-2 " style={{ border: '1px solid' }}></p>

              <p
                className="col col-md-4 text-hidden"
                style={{ border: '1px solid' }}
                data-toggle="tooltip"
                data-placement="top"
                title={dataDetail.data.student_code}
              >
                {dataDetail.data.student_code}
              </p>

              <p
                className="col col-md-6 text-hidden "
                style={{ border: '1px solid', padding: '0px 1px 0px 2px' }}
                data-toggle="tooltip"
                data-placement="top"
                title={dataDetail.data.last_name + ' ' + dataDetail.data.first_name}
              >
                {dataDetail.data.last_name + ' ' + dataDetail.data.first_name}
              </p>
            </div>
          )}
        </div>
        <div className="col col-md-7" style={{ paddingLeft: 0 }}>
          <div className="d-flex align-items-center" style={{ position: 'relative' }}>
            <div className="justify-content-center">
              <div className="d-flex my-custom-scrollbar">
                <div>
                  {/* Buoi */}
                  {(() => {
                    const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                      <p key={index} style={{ width: '90px', border: '1px solid' }}>
                        {index + 1}
                      </p>
                    ));
                    return <div className="d-flex text-center">{divs} </div>;
                  })()}
                  {/* Diem danh */}

                  {dataDetail.data !== undefined &&
                    dataDetail.data !== null &&
                    Object.values(dataDetail.data).length !== 0 &&
                    [dataDetail.data].map((item, index) => {
                      return (() => {
                        const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                          <div className="d-flex" key={index}>
                            {(() => {
                              const divs = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => (
                                <p style={{ width: 90 / dataDetail.numberLessonWeek, border: '1px solid' }}>
                                  <input type="radio" name="" id="" />
                                </p>
                              ));
                              return <div className="d-flex text-center">{divs} </div>;
                            })()}
                          </div>
                        ));
                        return (
                          <div className="d-flex text-center" key={index}>
                            {divs}
                          </div>
                        );
                      })();
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-md-1">
          <div className="row">
            <p className=" col col-md-6 text-center">-</p>
            <p className="col col-md-6 text-center">-</p>
          </div>
          {dataDetail.data !== undefined && dataDetail.data !== null && Object.values(dataDetail.data).length !== 0 && (
            <div className="row">
              <p className="col col-md-6 text-center" style={{ border: '1px solid #f3f3f5' }}>
                {dataDetail.data.score}
              </p>
              <p className="col col-md-6 text-center" style={{ border: '1px solid #f3f3f5' }}>
                <FaEdit />
              </p>
            </div>
          )}
        </div>
      </div>


// admin


<div className="row header_detail_classroom">
        <div className="col col-md-4 p-2">
          <div className="row">
            <p className=" col col-md-2 text-center">STT</p>
            <p className="col col-md-4 text-center">MSSV</p>
            <p className="col col-md-6 text-center">Tên sinh viên</p>
          </div>
        </div>
        <div className="col col-md-7 p-2 ">
          <div className="d-flex align-items-center justify-content-center">
            <p className=" text-center">Tuần</p>
          </div>
        </div>
        <div className="col col-md-1 p-2">
          <div className="row">
            <p className="col col-md-6 text-center">Điểm</p>
            <p className="col col-md-6 text-center">Action</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col col-md-4" style={{ marginTop: '2px' }}>
          <div className="row">
            <p className=" col col-md-2 text-center">-</p>
            <p className="col col-md-4 text-center">-</p>
            <p className="col col-md-6 text-center">-</p>
          </div>
          {dataDetail.data !== undefined &&
            dataDetail.data !== null &&
            dataDetail.data.map((item, index) => {
              return (
                <div className="row" key={index}>
                  <p className="col col-md-2 " style={{ border: '1px solid' }}>
                    {index + 1}
                  </p>

                  <p
                    className="col col-md-4 text-hidden"
                    style={{ border: '1px solid' }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={item.student_code}
                  >
                    {item.student_code}
                  </p>

                  <p
                    className="col col-md-6 text-hidden "
                    style={{ border: '1px solid', padding: '0px 1px 0px 2px' }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={item.last_name + ' ' + item.first_name}
                  >
                    {item.last_name + ' ' + item.first_name}
                  </p>
                </div>
              );
            })}
        </div>
        <div className="col col-md-7" style={{ paddingLeft: 0 }}>
          <div className="d-flex align-items-center" style={{ position: 'relative' }}>
            <div className="justify-content-center">
              <div className="d-flex my-custom-scrollbar">
                <div>
                  {/* Buoi */}
                  {(() => {
                    const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                      <p key={index} style={{ width: '90px', border: '1px solid' }}>
                        {index + 1}
                      </p>
                    ));
                    return <div className="d-flex text-center">{divs} </div>;
                  })()}
                  {/* Diem danh */}

                  {dataDetail.data !== undefined &&
                    dataDetail.data !== null &&
                    dataDetail.data.map((item, index) => {
                      return (() => {
                        const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                          <div className="d-flex" key={index}>
                            {(() => {
                              const divs = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => (
                                <p style={{ width: 90 / dataDetail.numberLessonWeek, border: '1px solid' }}>
                                  <input type="radio" name="" id="" />
                                </p>
                              ));
                              return <div className="d-flex text-center">{divs} </div>;
                            })()}
                          </div>
                        ));
                        return (
                          <div className="d-flex text-center" key={index}>
                            {divs}{' '}
                          </div>
                        );
                      })();
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-md-1">
          <div className="row">
            <p className=" col col-md-6 text-center">-</p>
            <p className="col col-md-6 text-center">-</p>
          </div>

          {dataDetail.data !== undefined &&
            dataDetail.data !== null &&
            dataDetail.data.map((item, index) => {
              return (
                <div className="row" key={index}>
                  <p className="col col-md-6 text-center" style={{ border: '1px solid #f3f3f5' }}>
                    {item.score}
                  </p>
                  <p className="col col-md-6 text-center" style={{ border: '1px solid #f3f3f5' }}>
                    <FaEdit />
                  </p>
                </div>
              );
            })}
        </div>
      </div>