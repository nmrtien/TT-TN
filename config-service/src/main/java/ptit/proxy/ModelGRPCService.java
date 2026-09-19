package ptit.proxy;

import com.hollow.grpc.ModelRequest;
import com.hollow.grpc.ModelResponse;
import com.hollow.grpc.ModelServiceGrpc;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import ptit.entity.Model;
import ptit.service.IModel;

import java.util.List;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class ModelGRPCService extends ModelServiceGrpc.ModelServiceImplBase {

    private final IModel modelService;
    private final GrpcModelMapper grpcModelMapper;

    @Override
    public void getModels(ModelRequest request, StreamObserver<ModelResponse> responseObserver) {
        Integer modelLevel = request.getModelLevel();
        log.info("getModels with modelLevel: {}", modelLevel);
        List<Model> models = modelService.list(modelLevel);
        ModelResponse response = ModelResponse.newBuilder()
                .addAllModels(grpcModelMapper.toGrpcModelList(models))
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
