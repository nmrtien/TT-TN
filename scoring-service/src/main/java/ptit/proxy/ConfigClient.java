package ptit.proxy;

import com.hollow.grpc.ModelData;
import com.hollow.grpc.ModelRequest;
import com.hollow.grpc.ModelResponse;
import com.hollow.grpc.ModelServiceGrpc;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Component;
import ptit.entity.Model;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ConfigClient {

    @GrpcClient("model-service")
    private ModelServiceGrpc.ModelServiceBlockingStub modelServiceStub;

    private final ClientModelMapper clientModelMapper;


    public List<Model> getModels(Integer level) {
        // 1. Tạo request
        ModelRequest request = ModelRequest.newBuilder()
                .setModelLevel(level != null ? level : 0)
                .build();

        // 2. Gọi gRPC Server nhận ModelResponse
        ModelResponse response = modelServiceStub.getModels(request);

        // 3. Lấy List<ModelData> từ Protobuf Response bằng getModelsList()
        List<ModelData> protoModelList = response.getModelsList();

        // 4. Map toàn bộ danh sách Proto sang List<ModelDto> của Client
        return clientModelMapper.toDtoList(protoModelList);
    }
}
