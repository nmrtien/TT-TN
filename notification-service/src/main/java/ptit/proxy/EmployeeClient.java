package ptit.proxy;

import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;
import com.hollow.grpc.EmployeeServiceGrpc;
import com.hollow.grpc.EmployeeRequest;

@Slf4j
@Service
public class EmployeeClient {

    @GrpcClient("employee-client")
    private EmployeeServiceGrpc.EmployeeServiceBlockingStub employeeStub;

    public String getMaNV(String maNV) {
        EmployeeRequest request = EmployeeRequest.newBuilder()
                .setMaNV(maNV)
                .build();

        String maNVResponse = employeeStub.getEmployeeCode(request).getMaNV();
        log.debug("CALL getMaNV to employee-client with maNVResponse: {}", maNVResponse);
        return employeeStub.getEmployeeCode(request).getMaNV();
    }
}
