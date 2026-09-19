package ptit.proxy;

import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import com.hollow.grpc.*;
import ptit.entity.CreditTask;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class EmployeeGRPCService extends EmployeeServiceGrpc.EmployeeServiceImplBase {

    private final INhanVien nhanVienService;

    @Override
    public void getEmployeeCode(EmployeeRequest request, StreamObserver<EmployeeResponse> responseObserver) {

        String maNVReq = request.getMaNV();
        log.info("getEmployeeCode with maNVReq: {}", maNVReq);

        String maNVRes = "";
        CreditTask nhanVien = nhanVienService.getNhanVien(maNVReq);
        if (nhanVien != null)
            maNVRes = nhanVien.getMaNhanVien();

        EmployeeResponse response = EmployeeResponse.newBuilder()
                .setMaNV(maNVRes)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
